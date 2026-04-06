import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { caseNo } = body;

  // Mock: randomly assign availability
  // In production, this would check casenote.kr and lbox APIs
  const mockResults: Record<string, { available: boolean; source: string | null }> = {
    "2024고단1234": { available: true, source: "casenote" },
    "2024고단5678": { available: true, source: "lbox" },
    "2024고합901": { available: true, source: "casenote" },
    "2024고단2345": { available: true, source: "casenote" },
    "2024고단6789": { available: true, source: "lbox" },
    "2024고단3456": { available: false, source: null },
    "2024고단7890": { available: false, source: null },
  };

  const result = mockResults[caseNo] || { available: false, source: null };

  return NextResponse.json({
    caseNo,
    available: result.available,
    source: result.source,
    checkedAt: new Date().toISOString(),
    message: result.available
      ? `${result.source}에서 전문 확인됨`
      : "casenote/lbox에 미등록. 등록 요청 필요",
  });
}
