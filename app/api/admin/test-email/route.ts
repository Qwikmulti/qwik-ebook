import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { sendTestEmail } from "@/lib/email";

// ── POST /api/admin/test-email ────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { email } = await req.json().catch(() => ({}));
  const target = email || process.env.ADMIN_EMAIL;

  if (!target) {
    return NextResponse.json({ error: "No email address provided." }, { status: 400 });
  }

  const result = await sendTestEmail(target);

  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    message: `Test email sent to ${target}`,
  });
}
