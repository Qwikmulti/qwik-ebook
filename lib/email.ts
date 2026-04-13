import nodemailer from "nodemailer";

// ─── Transporter ──────────────────────────────────────────────────────────
function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: false, // TLS via STARTTLS
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
}

// ─── Email HTML Template ──────────────────────────────────────────────────
function buildEbookEmailHtml(name: string, ebookUrl: string, ebookTitle: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Your Free UK Study Guide</title>
</head>
<body style="margin:0;padding:0;font-family:Georgia,serif;background:#f1f5f9;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#0a0f1e 0%,#1a2744 100%);padding:48px 40px;text-align:center;">
              <div style="font-size:36px;margin-bottom:8px;">🇬🇧</div>
              <h1 style="color:#f5a623;font-family:Georgia,serif;font-size:26px;margin:0 0 8px;font-weight:700;">UK Study & Travel Guide</h1>
              <p style="color:#94a3b8;font-size:14px;margin:0;font-family:Arial,sans-serif;">Your Comprehensive Free Resource</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:48px 40px;">
              <h2 style="color:#0a0f1e;font-family:Georgia,serif;font-size:22px;margin:0 0 16px;">Hello, ${name}! 👋</h2>
              <p style="color:#475569;font-family:Arial,sans-serif;font-size:15px;line-height:1.7;margin:0 0 24px;">
                Thank you for your interest in studying and traveling in the United Kingdom. We're thrilled to have you join our community of aspiring UK students.
              </p>
              <p style="color:#475569;font-family:Arial,sans-serif;font-size:15px;line-height:1.7;margin:0 0 32px;">
                Your free copy of <strong style="color:#0a0f1e;">${ebookTitle}</strong> is ready. Inside, you'll find everything you need — from university applications and student visas to accommodation and budgeting tips.
              </p>

              <!-- CTA Button -->
              <table cellpadding="0" cellspacing="0" style="margin:0 auto 32px;">
                <tr>
                  <td style="border-radius:10px;background:linear-gradient(135deg,#f5a623,#d4891a);text-align:center;">
                    <a href="${ebookUrl}" target="_blank"
                       style="display:inline-block;padding:18px 40px;color:#0a0f1e;font-family:Arial,sans-serif;font-size:16px;font-weight:700;text-decoration:none;border-radius:10px;letter-spacing:0.3px;">
                      📥 Download Your Free Guide
                    </a>
                  </td>
                </tr>
              </table>

              <!-- What's inside -->
              <div style="background:#f8fafc;border-radius:12px;padding:24px;margin-bottom:32px;border-left:4px solid #f5a623;">
                <p style="color:#0a0f1e;font-family:Arial,sans-serif;font-size:14px;font-weight:700;margin:0 0 12px;text-transform:uppercase;letter-spacing:0.5px;">What's inside the guide</p>
                <table cellpadding="0" cellspacing="0" width="100%">
                  ${["University admissions step-by-step", "Student visa application guide", "Cost of living breakdown", "Finding student accommodation", "Working rights while studying", "Healthcare & NHS access for students"].map(item => `
                  <tr>
                    <td style="padding:4px 0;">
                      <span style="color:#f5a623;font-size:14px;">✓</span>
                      <span style="color:#475569;font-family:Arial,sans-serif;font-size:14px;padding-left:8px;">${item}</span>
                    </td>
                  </tr>`).join("")}
                </table>
              </div>

              <p style="color:#94a3b8;font-family:Arial,sans-serif;font-size:13px;line-height:1.6;margin:0;">
                If the button doesn't work, copy and paste this link into your browser:<br/>
                <a href="${ebookUrl}" style="color:#f5a623;word-break:break-all;">${ebookUrl}</a>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f8fafc;padding:24px 40px;text-align:center;border-top:1px solid #e2e8f0;">
              <p style="color:#94a3b8;font-family:Arial,sans-serif;font-size:12px;margin:0 0 4px;">
                You received this because you signed up at our website.
              </p>
              <p style="color:#cbd5e1;font-family:Arial,sans-serif;font-size:11px;margin:0;">
                © ${new Date().getFullYear()} UK Study Guide. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

// ─── Send ebook email ─────────────────────────────────────────────────────
export async function sendEbookEmail({
  to,
  name,
  ebookUrl,
  ebookTitle,
}: {
  to: string;
  name: string;
  ebookUrl: string;
  ebookTitle: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const transporter = createTransporter();
    await transporter.verify();

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject: `Your FREE UK Study & Travel Guide is here! 🇬🇧`,
      html: buildEbookEmailHtml(name, ebookUrl, ebookTitle),
    });

    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown email error";
    console.error("[Email Error]", message);
    return { success: false, error: message };
  }
}

// ─── Send test email ──────────────────────────────────────────────────────
export async function sendTestEmail(to: string): Promise<{ success: boolean; error?: string }> {
  try {
    const transporter = createTransporter();
    await transporter.verify();

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject: "Test Email — UK Study Guide Admin",
      html: `
        <div style="font-family:Arial,sans-serif;max-width:500px;margin:40px auto;padding:32px;background:#f8fafc;border-radius:12px;border:1px solid #e2e8f0;">
          <h2 style="color:#0a0f1e;margin:0 0 16px;">✅ Email configuration working</h2>
          <p style="color:#475569;margin:0;">Your Nodemailer setup is correctly configured. Subscribers will receive their ebook emails automatically.</p>
        </div>
      `,
    });

    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown email error";
    return { success: false, error: message };
  }
}
