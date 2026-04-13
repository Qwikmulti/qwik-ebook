import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createSupabaseAdminClient } from "@/lib/supabase";

// ── GET /api/admin/subscribers ────────────────────────────────────────────
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") ?? "1");
  const perPage = parseInt(searchParams.get("perPage") ?? "10");
  const search = searchParams.get("search") ?? "";

  const supabase = createSupabaseAdminClient();
  const from = (page - 1) * perPage;
  const to = from + perPage - 1;

  let query = supabase
    .from("subscribers")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (search) {
    query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`);
  }

  const { data, error, count } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    data: {
      subscribers: data ?? [],
      total: count ?? 0,
      page,
      perPage,
      totalPages: Math.ceil((count ?? 0) / perPage),
    },
  });
}

// ── DELETE /api/admin/subscribers  (bulk delete all) ─────────────────────
export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  if (body.confirm !== "DELETE_ALL") {
    return NextResponse.json({ error: "Missing confirmation" }, { status: 400 });
  }

  const supabase = createSupabaseAdminClient();
  const { error } = await supabase
    .from("subscribers")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000"); // delete all rows

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true, message: "All subscribers deleted." });
}
