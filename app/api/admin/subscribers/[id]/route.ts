import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createSupabaseAdminClient } from "@/lib/supabase";
import { sendEbookEmail } from "@/lib/email";

type Params = { params: Promise<{ id: string }> };

// ── DELETE /api/admin/subscribers/[id] ───────────────────────────────────
export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const supabase = createSupabaseAdminClient();

  const { error } = await supabase.from("subscribers").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true, message: "Subscriber deleted." });
}

// ── POST /api/admin/subscribers/[id]/resend ───────────────────────────────
// Note: resend is a sub-route — see /api/admin/subscribers/[id]/resend/route.ts
// This GET returns a single subscriber
export async function GET(_req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const supabase = createSupabaseAdminClient();

  const { data, error } = await supabase
    .from("subscribers")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 404 });
  return NextResponse.json({ success: true, data });
}
