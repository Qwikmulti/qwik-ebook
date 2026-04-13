import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createSupabaseAdminClient } from "@/lib/supabase";

// ── GET /api/admin/stats ──────────────────────────────────────────────────
export async function GET(_req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = createSupabaseAdminClient();

  const [
    { count: totalSubscribers },
    { count: emailsSent },
    { count: emailsPending },
    { data: activeEbook },
    { data: recentSubscribers },
  ] = await Promise.all([
    supabase.from("subscribers").select("*", { count: "exact", head: true }),
    supabase
      .from("subscribers")
      .select("*", { count: "exact", head: true })
      .eq("email_sent", true),
    supabase
      .from("subscribers")
      .select("*", { count: "exact", head: true })
      .eq("email_sent", false),
    supabase
      .from("ebooks")
      .select("*")
      .eq("is_active", true)
      .order("uploaded_at", { ascending: false })
      .limit(1)
      .single(),
    supabase
      .from("subscribers")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(10),
  ]);

  return NextResponse.json({
    success: true,
    data: {
      totalSubscribers: totalSubscribers ?? 0,
      emailsSent: emailsSent ?? 0,
      emailsPending: emailsPending ?? 0,
      activeEbook: activeEbook ?? null,
      recentSubscribers: recentSubscribers ?? [],
    },
  });
}
