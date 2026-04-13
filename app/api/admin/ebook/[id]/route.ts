import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createSupabaseAdminClient } from "@/lib/supabase";

type Params = { params: Promise<{ id: string }> };

// ── PATCH /api/admin/ebook/[id] — set as active ───────────────────────────
export async function PATCH(_req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const supabase = createSupabaseAdminClient();

  // Deactivate all
  await supabase.from("ebooks").update({ is_active: false }).eq("is_active", true);

  // Activate selected
  const { data, error } = await supabase
    .from("ebooks")
    .update({ is_active: true })
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true, data });
}

// ── DELETE /api/admin/ebook/[id] — remove ebook ───────────────────────────
export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const supabase = createSupabaseAdminClient();

  // Get ebook to find storage path
  const { data: ebook } = await supabase
    .from("ebooks")
    .select("file_url, file_name")
    .eq("id", id)
    .single();

  if (ebook?.file_url) {
    // Extract storage path from URL
    const url = new URL(ebook.file_url);
    const pathParts = url.pathname.split("/ebooks/");
    if (pathParts[1]) {
      await supabase.storage.from("ebooks").remove([pathParts[1]]);
    }
  }

  const { error } = await supabase.from("ebooks").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true, message: "Ebook deleted." });
}
