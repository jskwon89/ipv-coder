import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return Response.json({ error: '파일을 업로드해주세요.' }, { status: 400 });
    }

    const fileName = file.name.toLowerCase();
    let text = '';

    if (fileName.endsWith('.pdf')) {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const pdfParse = require('pdf-parse') as (buf: Buffer) => Promise<{ text: string }>;
      const buffer = Buffer.from(await file.arrayBuffer());
      const data = await pdfParse(buffer);
      text = data.text;
    } else if (fileName.endsWith('.txt')) {
      text = await file.text();
    } else if (fileName.endsWith('.hwp') || fileName.endsWith('.hwpx')) {
      // HWP는 직접 파싱이 어려우므로 바이너리에서 텍스트 추출 시도
      const buffer = Buffer.from(await file.arrayBuffer());
      // HWP 파일에서 텍스트 부분만 추출 (간이 방식)
      const rawText = buffer.toString('utf-8').replace(/[^\uAC00-\uD7AF\u1100-\u11FF\u3130-\u318F\uA960-\uA97F\uD7B0-\uD7FF\u0020-\u007E\n\r\t.,?!:;()\[\]{}'"~@#$%&*+=<>/\\|-]/g, ' ');
      text = rawText.replace(/\s{3,}/g, '\n').trim();
      if (text.length < 50) {
        return Response.json({
          error: 'HWP 파일을 읽지 못했습니다. PDF 또는 TXT로 변환 후 업로드해주세요.',
        }, { status: 400 });
      }
    } else {
      return Response.json(
        { error: 'PDF, TXT, HWP 파일만 지원합니다.' },
        { status: 400 },
      );
    }

    if (!text.trim()) {
      return Response.json(
        { error: '파일에서 텍스트를 추출할 수 없습니다.' },
        { status: 400 },
      );
    }

    // 텍스트에서 설문 문항을 자동 파싱
    const questions = parseQuestionsFromText(text);

    return Response.json({
      title: extractTitle(text),
      questions,
      rawTextLength: text.length,
    });
  } catch (error) {
    console.error('Survey parse error:', error);
    return Response.json(
      { error: '파일 처리 중 오류가 발생했습니다.' },
      { status: 500 },
    );
  }
}

// ─── 텍스트에서 설문 제목 추출 ───
function extractTitle(text: string): string {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  // 첫 번째 의미 있는 줄을 제목으로
  for (const line of lines.slice(0, 5)) {
    if (line.length > 3 && line.length < 100) {
      return line.replace(/^[■□●○▶▷★☆\-*#]+\s*/, '');
    }
  }
  return '설문조사';
}

interface ParsedQuestion {
  id: string;
  text: string;
  type: 'radio' | 'checkbox' | 'scale' | 'short' | 'long';
  required: boolean;
  options?: string[];
  scaleSize?: 5 | 7;
  scaleLabels?: { left: string; right: string };
}

// ─── 텍스트에서 설문 문항 자동 파싱 ───
function parseQuestionsFromText(text: string): ParsedQuestion[] {
  const questions: ParsedQuestion[] = [];
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];

    // 번호가 붙은 문항 패턴: "1.", "1)", "Q1.", "문1." 등
    const qMatch = line.match(/^(?:Q|문|q)?\.?\s*(\d+)\s*[.):\-]\s*(.+)/);
    if (qMatch) {
      const questionText = qMatch[2].trim();
      const options: string[] = [];
      let type: ParsedQuestion['type'] = 'short';

      // 다음 줄들에서 보기 수집
      let j = i + 1;
      while (j < lines.length) {
        const optLine = lines[j];
        // 보기 패턴: "①②③", "1)2)3)", "가.나.다.", "(1)(2)(3)" 등
        const optMatch = optLine.match(/^(?:[①②③④⑤⑥⑦⑧⑨⑩]|[가나다라마바사아자차카타파하][\.\):]|\(\d+\)|\d+[)\.])\s*(.+)/);
        if (optMatch) {
          options.push(optMatch[1].trim());
          j++;
        } else {
          break;
        }
      }

      // 유형 판별
      if (options.length > 0) {
        type = 'radio';
      } else if (
        questionText.includes('리커트') ||
        questionText.includes('척도') ||
        questionText.match(/[15]점/) ||
        questionText.includes('매우 그렇다') ||
        questionText.includes('동의')
      ) {
        type = 'scale';
      } else if (
        questionText.includes('자유롭게') ||
        questionText.includes('서술') ||
        questionText.includes('기술해') ||
        questionText.includes('작성해')
      ) {
        type = 'long';
      }

      const q: ParsedQuestion = {
        id: generateId(),
        text: questionText,
        type,
        required: true,
      };

      if (type === 'radio' && options.length > 0) {
        q.options = options;
      }
      if (type === 'scale') {
        q.scaleSize = 5;
        q.scaleLabels = { left: '전혀 그렇지 않다', right: '매우 그렇다' };
      }

      questions.push(q);
      i = j;
      continue;
    }

    // 리커트 척도 패턴 감지 (번호 없이)
    if (
      line.length > 10 &&
      line.endsWith('?') &&
      !line.match(/^[①②③④⑤]/)
    ) {
      // 질문처럼 보이는 줄
      const options: string[] = [];
      let j = i + 1;
      while (j < lines.length) {
        const optLine = lines[j];
        const optMatch = optLine.match(/^(?:[①②③④⑤⑥⑦⑧⑨⑩]|[가나다라마바사아자차카타파하][\.\):]|\(\d+\)|\d+[)\.])\s*(.+)/);
        if (optMatch) {
          options.push(optMatch[1].trim());
          j++;
        } else {
          break;
        }
      }

      const q: ParsedQuestion = {
        id: generateId(),
        text: line,
        type: options.length > 0 ? 'radio' : 'short',
        required: true,
      };
      if (options.length > 0) q.options = options;

      questions.push(q);
      i = j;
      continue;
    }

    i++;
  }

  return questions;
}

function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}
