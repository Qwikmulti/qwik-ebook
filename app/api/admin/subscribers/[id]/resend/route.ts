import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createSupabaseAdminClient } from "@/lib/supabase";
import { sendEbookEmail } from "@/lib/email";
import type { Subscriber, Ebook } from "@/types";

type Params = { params: Promise<{ id: string }> };

// ── POST /api/admin/subscribers/[id]/resend ───────────────────────────────
export async function POST(_req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const supabase = createSupabaseAdminClient();

  // Fetch subscriber
  const { data: subscriber, error: subError } = await supabase
    .from("subscribers")
    .select("*")
    .eq("id", id)
    .single() as { data: Subscriber | null; error: null };

  if (subError || !subscriber) {
    return NextResponse.json({ error: "Subscriber not found." }, { status: 404 });
  }

  // Fetch active ebook
  const { data: ebook } = await supabase
    .from("ebooks")
    .select("*")
    .eq("is_active", true)
    .order("uploaded_at", { ascending: false })
    .limit(1)
    .single() as { data: Ebook | null; error: null };

  if (!ebook) {
    return NextResponse.json(
      { error: "No active ebook found. Please upload an ebook first." },
      { status: 404 }
    );
  }

  // Send email
  const result = await sendEbookEmail({
    to: subscriber.email,
    name: subscriber.name,
    ebookUrl: ebook.file_url,
    ebookTitle: ebook.title,
  });

  if (!result.success) {
    return NextResponse.json(
      { error: `Email failed: ${result.error}` },
      { status: 500 }
    );
  }

  // Update subscriber record
  await (supabase.from("subscribers") as any)
    .update({ email_sent: true, email_sent_at: new Date().toISOString() })
    .eq("id", id);

  return NextResponse.json({
    success: true,
    message: `Ebook resent to ${subscriber.email}`,
  });
}
