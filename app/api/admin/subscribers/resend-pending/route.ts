import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createSupabaseAdminClient } from "@/lib/supabase";
import { sendEbookEmail } from "@/lib/email";
import type { Subscriber, Ebook } from "@/types";

// ── POST /api/admin/subscribers/resend-pending ────────────────────────────
// Sends the specified or active ebook to subscribers
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const { ebook_id, scope = "pending" } = body;

  const supabase = createSupabaseAdminClient();

  // Fetch ebook (either specific OR active)
  let ebook: Ebook | null = null;
  if (ebook_id) {
    const { data } = await supabase.from("ebooks").select("*").eq("id", ebook_id).single();
    ebook = data as Ebook | null;
  } else {
    const { data } = await supabase
      .from("ebooks")
      .select("*")
      .eq("is_active", true)
      .order("uploaded_at", { ascending: false })
      .limit(1)
      .single();
    ebook = data as Ebook | null;
  }

  if (!ebook) {
    return NextResponse.json(
      { error: "Ebook not found. Please upload or select a valid ebook." },
      { status: 404 }
    );
  }

  // Fetch subscribers based on scope
  let query = supabase.from("subscribers").select("*");
  if (scope === "pending") {
    query = query.eq("email_sent", false);
  }
  
  const { data: recipients } = await query as { data: Subscriber[]; error: null };

  if (!recipients || recipients.length === 0) {
    return NextResponse.json({
      success: true,
      message: `No ${scope} subscribers found.`,
      data: { sent: 0, failed: 0 },
    });
  }

  let sent = 0;
  let failed = 0;

  // Send emails with a small delay to avoid rate limits
  for (const subscriber of recipients) {
    const result = await sendEbookEmail({
      to: subscriber.email,
      name: subscriber.name,
      ebookUrl: ebook.file_url,
      ebookTitle: ebook.title,
    });

    if (result.success) {
      sent++;
      await (supabase.from("subscribers") as any)
        .update({ email_sent: true, email_sent_at: new Date().toISOString() })
        .eq("id", subscriber.id);
    } else {
      failed++;
    }

    // Small delay to respect SMTP rate limits
    await new Promise((r) => setTimeout(r, 300));
  }

  return NextResponse.json({
    success: true,
    message: `Batch complete: ${sent} sent, ${failed} failed.`,
    data: { sent, failed, total: recipients.length },
  });
}
