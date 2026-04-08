import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BUCKET = "uploads";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const projectId = formData.get("projectId") as string | null;

    if (!file) {
      return NextResponse.json({ error: "파일이 없습니다" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // bucket 없으면 생성
    const { data: buckets } = await supabaseAdmin.storage.listBuckets();
    if (!buckets?.find((b) => b.name === BUCKET)) {
      await supabaseAdmin.storage.createBucket(BUCKET, { public: false });
    }

    const ext = file.name.split(".").pop() || "pdf";
    const safeFileName = `${Date.now()}.${ext}`;
    const storagePath = `${projectId || "general"}/${safeFileName}`;

    const { error } = await supabaseAdmin.storage
      .from(BUCKET)
      .upload(storagePath, buffer, {
        contentType: file.type || "application/octet-stream",
      });

    if (error) {
      return NextResponse.json({ error: `업로드 실패: ${error.message}` }, { status: 500 });
    }

    // 원래 파일명을 DB에 기록
    await supabaseAdmin.from("file_uploads").insert({
      project_id: projectId || "general",
      original_name: file.name,
      storage_path: storagePath,
      size: buffer.length,
      content_type: file.type || "application/octet-stream",
    });

    return NextResponse.json({
      success: true,
      fileName: file.name,
      savedAs: safeFileName,
      storagePath,
      size: buffer.length,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("파일 저장 오류:", msg);
    return NextResponse.json({ error: `파일 저장에 실패했습니다: ${msg}` }, { status: 500 });
  }
}
