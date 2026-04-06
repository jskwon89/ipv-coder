import { NextRequest, NextResponse } from "next/server";

// Mock data
const mockCases = [
  { id: "c1", seq: 1, court: "서울중앙지방법원", caseNo: "2024고단1234", charge: "상해", status: "coded", projectId: "1" },
  { id: "c2", seq: 2, court: "수원지방법원", caseNo: "2024고단5678", charge: "폭행, 재물손괴", status: "coded", projectId: "1" },
  { id: "c3", seq: 3, court: "인천지방법원", caseNo: "2024고합901", charge: "상해, 협박", status: "coding", projectId: "1" },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get("projectId");

  const filtered = projectId
    ? mockCases.filter((c) => c.projectId === projectId)
    : mockCases;

  return NextResponse.json({ cases: filtered, total: filtered.length });
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  // Placeholder: just echo back with generated id
  const newCase = {
    id: `c${Date.now()}`,
    seq: body.seq || 1,
    court: body.court || "",
    caseNo: body.caseNo || "",
    charge: body.charge || "",
    status: "pending",
    projectId: body.projectId || "1",
  };

  return NextResponse.json({ case: newCase, success: true }, { status: 201 });
}
