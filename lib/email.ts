import "server-only"

import nodemailer, { type Transporter } from "nodemailer"

import { site } from "@/data/site"

/*
 * Outgoing email over plain SMTP via Nodemailer. Works with any provider:
 * Gmail (smtp.gmail.com + an App Password) for free, or Brevo / Resend /
 * Zoho by changing the SMTP_* environment variables — no code changes.
 */

export function isEmailConfigured() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS)
}

let transporter: Transporter | null = null

function getTransporter() {
  if (!transporter) {
    const port = Number(process.env.SMTP_PORT || 465)
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      secure: port === 465,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    })
  }
  return transporter
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!)
}

/** Minimal, email-client-safe layout with the brand mark. */
function layout(title: string, body: string) {
  return `<!doctype html>
<html><body style="margin:0;background:#f4f4f5;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#18181b">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:32px 12px">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#ffffff;border:1px solid #e4e4e7;border-radius:16px">
        <tr><td style="padding:28px 28px 0">
          <table role="presentation" cellpadding="0" cellspacing="0"><tr>
            <td style="width:28px;height:28px;background:#ff2a33;border-radius:8px;color:#fff;font:bold 14px monospace;text-align:center">&gt;_</td>
            <td style="padding-left:10px;font-weight:600;font-size:15px">${site.name}</td>
          </tr></table>
          <h1 style="margin:24px 0 0;font-size:20px;line-height:1.3">${title}</h1>
        </td></tr>
        <tr><td style="padding:12px 28px 28px;font-size:15px;line-height:1.6;color:#3f3f46">${body}</td></tr>
      </table>
      <p style="margin:16px 0 0;font-size:12px;color:#a1a1aa">${site.name} · ${site.url.replace("https://", "")}</p>
    </td></tr>
  </table>
</body></html>`
}

async function send(message: { to: string; subject: string; text: string; html: string }) {
  await getTransporter().sendMail({
    from: process.env.MAIL_FROM || `${site.name} <${process.env.SMTP_USER}>`,
    ...message,
  })
}

/** Sent right after someone applies. */
export async function sendApplicationReceived({ to, name, trackName }: { to: string; name: string; trackName: string }) {
  const first = name.split(" ")[0]
  await send({
    to,
    subject: `We got your application, ${first}`,
    text: `Hi ${first},\n\nThanks for applying to the ${trackName} track at ${site.name}. Applying is free.\n\nNext, we'll message you on WhatsApp to schedule your free 1:1 session with a mentor. After it, you decide whether to continue.\n\n— ${site.name}`,
    html: layout(
      `We got your application, ${escapeHtml(first)}`,
      `<p style="margin:0">Thanks for applying to the <strong>${escapeHtml(trackName)}</strong> track. Applying is free.</p>
       <p>Next, we'll message you on WhatsApp to schedule your <strong>free 1:1 session</strong> with a mentor. After it, you decide whether to continue.</p>
       <p style="margin-bottom:0">— ${site.name}</p>`
    ),
  })
}

/** Sent when an admin creates or resets a student's portal login. */
export async function sendPortalCredentials({ to, name, password }: { to: string; name: string; password: string }) {
  const first = name.split(" ")[0]
  const loginUrl = `${site.url}/portal/login`
  await send({
    to,
    subject: `Your ${site.name} student portal login`,
    text: `Hi ${first},\n\nYour student portal is ready.\n\nEmail: ${to}\nPassword: ${password}\n\nLog in at ${loginUrl} and change your password from the Account section.\n\n— ${site.name}`,
    html: layout(
      "Your student portal is ready",
      `<p style="margin:0">Hi ${escapeHtml(first)}, here's your login:</p>
       <table role="presentation" cellpadding="0" cellspacing="0" style="margin:16px 0;width:100%;background:#f4f4f5;border-radius:12px">
         <tr><td style="padding:14px 16px;font-size:14px">
           <div style="color:#71717a;font-size:12px">Email</div>
           <div style="font-family:monospace">${escapeHtml(to)}</div>
           <div style="color:#71717a;font-size:12px;margin-top:10px">Password</div>
           <div style="font-family:monospace;font-size:16px;color:#18181b">${escapeHtml(password)}</div>
         </td></tr>
       </table>
       <a href="${loginUrl}" style="display:inline-block;background:#d11a22;color:#fff;text-decoration:none;padding:10px 20px;border-radius:999px;font-weight:600">Log in to your portal</a>
       <p style="margin:16px 0 0;font-size:13px;color:#71717a">Change your password from the Account section after you log in.</p>`
    ),
  })
}
