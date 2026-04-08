import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const projectId = formData.get("projectId") as string | null;

    if (!file) {
      return NextResponse.json({ error: "파일이 없습니다" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // 프로젝트별 폴더에 파일 저장
    const uploadsDir = path.join(process.cwd(), "uploads", projectId || "general");
    fs.mkdirSync(uploadsDir, { recursive: true });

    const safeFileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9가-힣._-]/g, "_")}`;
    const filePath = path.join(uploadsDir, safeFileName);
    fs.writeFileSync(filePath, buffer);

    return NextResponse.json({
      success: true,
      fileName: file.name,
      savedAs: safeFileName,
      size: buffer.length,
    });
  } catch (error) {
    console.error("파일 저장 오류:", error);
    return NextResponse.json({ error: "파일 저장에 실패했습니다" }, { status: 500 });
  }
}
