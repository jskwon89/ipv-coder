import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const caseId = formData.get("caseId") as string | null;
    const projectId = formData.get("projectId") as string | null;

    if (!file) {
      return NextResponse.json({ error: "파일이 없습니다" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // pdf-parse로 텍스트 추출
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const pdfParse = require("pdf-parse");
    const data = await pdfParse(buffer);
    const text = data.text;

    if (!text || text.trim().length === 0) {
      return NextResponse.json({ error: "PDF에서 텍스트를 추출할 수 없습니다" }, { status: 400 });
    }

    // caseId가 있으면 해당 사건에 텍스트 저장
    if (caseId && projectId) {
      const { getCase, updateCase } = await import("@/lib/db");
      const existing = await getCase(projectId, caseId);
      if (existing) {
        await updateCase(projectId, caseId, {
          sourceText: text,
          status: "fetched",
        });
      }
    }

    return NextResponse.json({
      success: true,
      text,
      pages: data.numpages,
      chars: text.length,
    });
  } catch (error) {
    console.error("PDF 파싱 오류:", error);
    return NextResponse.json({ error: "PDF 파싱에 실패했습니다" }, { status: 500 });
  }
}
