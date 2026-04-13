import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createSupabaseAdminClient } from "@/lib/supabase";
import { sendEbookEmail } from "@/lib/email";

// ── POST /api/admin/subscribers/resend-pending ────────────────────────────
// Sends the active ebook to all subscribers where email_sent = false
export async function POST(_req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = createSupabaseAdminClient();

  // Fetch active ebook
  const { data: ebook } = await supabase
    .from("ebooks")
    .select("*")
    .eq("is_active", true)
    .order("uploaded_at", { ascending: false })
    .limit(1)
    .single();

  if (!ebook) {
    return NextResponse.json(
      { error: "No active ebook found. Upload an ebook first." },
      { status: 404 }
    );
  }

  // Fetch all pending subscribers
  const { data: pending } = await supabase
    .from("subscribers")
    .select("*")
    .eq("email_sent", false);

  if (!pending || pending.length === 0) {
    return NextResponse.json({
      success: true,
      message: "No pending subscribers found.",
      data: { sent: 0, failed: 0 },
    });
  }

  let sent = 0;
  let failed = 0;

  // Send emails with a small delay to avoid rate limits
  for (const subscriber of pending) {
    const result = await sendEbookEmail({
      to: subscriber.email,
      name: subscriber.name,
      ebookUrl: ebook.file_url,
      ebookTitle: ebook.title,
    });

    if (result.success) {
      sent++;
      await supabase
        .from("subscribers")
        .update({ email_sent: true, email_sent_at: new Date().toISOString() })
        .eq("id", subscriber.id);
    } else {
      failed++;
      console.error(`[Batch Resend] Failed for ${subscriber.email}:`, result.error);
    }

    // Small delay to respect SMTP rate limits
    await new Promise((r) => setTimeout(r, 300));
  }

  return NextResponse.json({
    success: true,
    message: `Batch complete: ${sent} sent, ${failed} failed.`,
    data: { sent, failed, total: pending.length },
  });
}
