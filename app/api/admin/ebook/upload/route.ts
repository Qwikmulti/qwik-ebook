import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createSupabaseAdminClient } from "@/lib/supabase";
import type { Ebook } from "@/types";

// ── POST /api/admin/ebook/upload ──────────────────────────────────────────
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const title = (formData.get("title") as string | null)?.trim();

    if (!file) return NextResponse.json({ error: "No file provided." }, { status: 400 });
    if (!title) return NextResponse.json({ error: "Ebook title is required." }, { status: 400 });
    if (file.type !== "application/pdf") {
      return NextResponse.json({ error: "Only PDF files are allowed." }, { status: 400 });
    }
    if (file.size > 50 * 1024 * 1024) {
      return NextResponse.json({ error: "File size must be under 50MB." }, { status: 400 });
    }

    const supabase = createSupabaseAdminClient();

    // Build a unique storage path
    const timestamp = Date.now();
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const storagePath = `${timestamp}_${safeName}`;

    // Upload to Supabase Storage
    const fileBuffer = await file.arrayBuffer();
    const { error: uploadError } = await supabase.storage
      .from("ebooks")
      .upload(storagePath, fileBuffer, {
        contentType: "application/pdf",
        upsert: false,
      });

    if (uploadError) {
      console.error("[Ebook Upload] Storage error:", uploadError);
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    // Get public URL
    const { data: urlData } = supabase.storage.from("ebooks").getPublicUrl(storagePath);
    const publicUrl = urlData.publicUrl;

    // Deactivate all previous ebooks
    await (supabase.from("ebooks") as any).update({ is_active: false }).eq("is_active", true);

    // Insert new ebook record as active
    const { data: ebook, error: insertError } = await (supabase.from("ebooks") as any)
      .insert({
        title,
        file_url: publicUrl,
        file_name: file.name,
        is_active: true,
      })
      .select()
      .single();

    if (insertError) {
      console.error("[Ebook Upload] DB insert error:", insertError);
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Ebook uploaded and set as active.",
      data: ebook as Ebook,
    });
  } catch (err) {
    console.error("[Ebook Upload] Unexpected error:", err);
    return NextResponse.json({ error: "Upload failed. Please try again." }, { status: 500 });
  }
}

// ── GET /api/admin/ebook/upload — fetch all ebooks ────────────────────────
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("ebooks")
    .select("*")
    .order("uploaded_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true, data: data ?? [] });
}
