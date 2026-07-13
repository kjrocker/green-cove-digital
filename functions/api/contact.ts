import { AwsClient } from "aws4fetch";

interface Env {
  AWS_ACCESS_KEY_ID: string;
  AWS_SECRET_ACCESS_KEY: string;
  AWS_REGION: string;
  CONTACT_TO_EMAIL: string;
  CONTACT_FROM_EMAIL: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_MESSAGE_LEN = 5000;

function redirect(url: URL, path: string, status = 303): Response {
  return Response.redirect(new URL(path, url).toString(), status);
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

async function sendEmail(
  aws: AwsClient,
  region: string,
  from: string,
  {
    to,
    replyTo,
    subject,
    html,
    text,
  }: {
    to: string;
    replyTo?: string;
    subject: string;
    html: string;
    text: string;
  },
): Promise<void> {
  const res = await aws.fetch(
    `https://email.${region}.amazonaws.com/v2/email/outbound-emails`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        FromEmailAddress: from,
        Destination: { ToAddresses: [to] },
        ...(replyTo ? { ReplyToAddresses: [replyTo] } : {}),
        Content: {
          Simple: {
            Subject: { Data: subject },
            Body: {
              Html: { Data: html },
              Text: { Data: text },
            },
          },
        },
      }),
    },
  );
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`SES ${res.status}: ${body}`);
  }
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const url = new URL(request.url);
  const form = await request.formData();

  if ((form.get("company") ?? "").toString().trim() !== "") {
    return redirect(url, "/thanks");
  }

  const name = (form.get("name") ?? "").toString().trim();
  const email = (form.get("email") ?? "").toString().trim();
  const message = (form.get("message") ?? "").toString().trim();

  if (
    !name ||
    !email ||
    !message ||
    !EMAIL_RE.test(email) ||
    message.length > MAX_MESSAGE_LEN
  ) {
    return redirect(url, "/contact?error=1");
  }

  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeMessage = escapeHtml(message).replace(/\n/g, "<br>");

  const aws = new AwsClient({
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
    region: env.AWS_REGION,
    service: "ses",
  });

  // Owner notification — required.
  try {
    await sendEmail(aws, env.AWS_REGION, env.CONTACT_FROM_EMAIL, {
      to: env.CONTACT_TO_EMAIL,
      replyTo: email,
      subject: `New contact form submission from ${name}`,
      html: `<p><strong>Name:</strong> ${safeName}</p>
<p><strong>Email:</strong> ${safeEmail}</p>
<p><strong>Message:</strong></p>
<p>${safeMessage}</p>`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
    });
  } catch (err) {
    console.error("Contact form owner notification failed:", err);
    return redirect(url, "/contact?error=1");
  }

  // Visitor auto-reply — best effort (SES sandbox rejects unverified recipients).
  try {
    await sendEmail(aws, env.AWS_REGION, env.CONTACT_FROM_EMAIL, {
      to: email,
      subject: "Thanks for reaching out to Green Cove Digital",
      html: `<p>Hi ${safeName},</p>
<p>Thanks for your message — I've received it and will get back to you within one business day.</p>
<p>For reference, here's what you sent:</p>
<blockquote>${safeMessage}</blockquote>
<p>— Kevin<br>Green Cove Digital</p>`,
      text: `Hi ${name},

Thanks for your message — I've received it and will get back to you within one business day.

For reference, here's what you sent:

${message}

— Kevin
Green Cove Digital`,
    });
  } catch (err) {
    console.error("Contact form auto-reply failed (non-fatal):", err);
  }

  return redirect(url, "/thanks");
};
