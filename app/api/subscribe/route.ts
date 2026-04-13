import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase";
import { sendEbookEmail } from "@/lib/email";
import { subscribeSchema } from "@/lib/validations";
import type { Subscriber, Ebook } from "@/types";

export async function POST(req: NextRequest) {
  try {
    // ── 1. Parse & validate body ──────────────────────────────────────────
    const body = await req.json();
    const parsed = subscribeSchema.safeParse(body);

    if (!parsed.success) {
      const firstError = parsed.error.errors[0]?.message ?? "Invalid input";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const { name, email } = parsed.data;
    const supabase = createSupabaseAdminClient();

    // ── 2. Check for duplicate email ──────────────────────────────────────
    const { data: existing } = await supabase
      .from("subscribers")
      .select("id, email_sent")
      .eq("email", email)
      .single() as { data: Pick<Subscriber, "id" | "email_sent"> | null; error: null };

    if (existing) {
      // Already registered — resend if email wasn't sent yet
      if (!existing.email_sent) {
        await resendEbook(supabase, existing.id, name, email);
      }
      return NextResponse.json(
        { error: "This email is already registered. Check your inbox (or spam folder)!" },
        { status: 409 }
      );
    }

    // ── 3. Insert new subscriber ──────────────────────────────────────────
    const { data: subscriber, error: insertError } = await supabase
      .from("subscribers")
      .insert({ name, email } as any)
      .select()
      .single() as { data: Subscriber; error: null };

    if (insertError || !subscriber) {
      console.error("[Subscribe] Insert error:", insertError);
      return NextResponse.json(
        { error: "Failed to save your registration. Please try again." },
        { status: 500 }
      );
    }

    // ── 4. Fetch the active ebook ─────────────────────────────────────────
    const { data: ebook } = await supabase
      .from("ebooks")
      .select("*")
      .eq("is_active", true)
      .order("uploaded_at", { ascending: false })
      .limit(1)
      .single() as { data: Ebook | null; error: null };

    // ── 5. Send email ─────────────────────────────────────────────────────
    let emailSent = false;

    if (ebook) {
      const result = await sendEbookEmail({
        to: email,
        name,
        ebookUrl: ebook.file_url,
        ebookTitle: ebook.title,
      });

      if (result.success) {
        emailSent = true;
        // Update subscriber record
        await (supabase.from("subscribers") as any)
          .update({ email_sent: true, email_sent_at: new Date().toISOString() })
          .eq("id", subscriber.id);
      } else {
        console.error("[Subscribe] Email send failed:", result.error);
      }
    } else {
      // No ebook uploaded yet — subscriber saved, email pending
      console.warn("[Subscribe] No active ebook found — subscriber saved but no email sent.");
    }

    // ── 6. Return success ─────────────────────────────────────────────────
    return NextResponse.json({
      success: true,
      message: emailSent
        ? "You're registered! Check your inbox for the guide."
        : "You're registered! We'll send your guide shortly.",
      data: {
        id: subscriber.id,
        emailSent,
        hasEbook: !!ebook,
      },
    });
  } catch (err) {
    console.error("[Subscribe] Unexpected error:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}

// ── Helper: resend to existing subscriber ────────────────────────────────
async function resendEbook(
  supabase: ReturnType<typeof createSupabaseAdminClient>,
  subscriberId: string,
  name: string,
  email: string
) {
  const { data: ebook } = await supabase
    .from("ebooks")
    .select("*")
    .eq("is_active", true)
    .order("uploaded_at", { ascending: false })
    .limit(1)
    .single() as { data: Ebook | null; error: null };

  if (!ebook) return;

  const result = await sendEbookEmail({
    to: email,
    name,
    ebookUrl: ebook.file_url,
    ebookTitle: ebook.title,
  });

  if (result.success) {
    await (supabase.from("subscribers") as any)
      .update({ email_sent: true, email_sent_at: new Date().toISOString() })
      .eq("id", subscriberId);
  }
}
