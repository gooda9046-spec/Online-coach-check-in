import { Resend } from "resend";

// Resend's shared onboarding@resend.dev sender works without verifying a
// domain — fine for a beta. Verify your own domain and set EMAIL_FROM once
// this needs to look like it's really from you.
const FROM = process.env.EMAIL_FROM || "Forge <onboarding@resend.dev>";

let client: Resend | null = null;
function getClient(): Resend | null {
  if (client) return client;
  if (!process.env.RESEND_API_KEY) return null;
  client = new Resend(process.env.RESEND_API_KEY);
  return client;
}

export async function sendEmail(opts: { to: string; subject: string; html: string }): Promise<void> {
  const resend = getClient();
  if (!resend) {
    // No API key configured (e.g. local dev without one set) — log instead
    // of silently failing, so the flow is still testable end-to-end.
    console.log(`[email] RESEND_API_KEY not set — would have sent to ${opts.to}: ${opts.subject}`);
    console.log(opts.html);
    return;
  }

  const { error } = await resend.emails.send({
    from: FROM,
    to: opts.to,
    subject: opts.subject,
    html: opts.html,
  });
  if (error) {
    throw new Error(`Failed to send email: ${error.message}`);
  }
}

function emailShell(bodyHtml: string): string {
  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px; color: #0f172a;">
      <p style="font-weight: 700; font-size: 18px; margin: 0 0 24px;">Forge</p>
      ${bodyHtml}
      <p style="margin-top: 32px; font-size: 12px; color: #64748b;">
        If you didn't request this, you can safely ignore this email.
      </p>
    </div>
  `;
}

export async function sendPasswordResetEmail(to: string, resetUrl: string): Promise<void> {
  await sendEmail({
    to,
    subject: "Reset your Forge password",
    html: emailShell(`
      <p style="font-size: 15px; line-height: 1.5;">We got a request to reset your Forge password. This link expires in 1 hour.</p>
      <p style="margin: 24px 0;">
        <a href="${resetUrl}" style="background: #2f7dff; color: white; padding: 10px 20px; border-radius: 999px; text-decoration: none; font-weight: 600; font-size: 14px;">Reset password</a>
      </p>
      <p style="font-size: 13px; color: #64748b;">Or paste this link into your browser: ${resetUrl}</p>
    `),
  });
}

export async function sendTwoFactorCodeEmail(to: string, code: string): Promise<void> {
  await sendEmail({
    to,
    subject: `${code} is your Forge login code`,
    html: emailShell(`
      <p style="font-size: 15px; line-height: 1.5;">Enter this code to finish logging in. It expires in 10 minutes.</p>
      <p style="font-size: 32px; font-weight: 700; letter-spacing: 6px; margin: 24px 0;">${code}</p>
    `),
  });
}
