interface Env {
  RESEND_API_KEY: string;
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
  apiKey: string,
  payload: Record<string, unknown>,
): Promise<void> {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Resend ${res.status}: ${body}`);
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

  try {
    await Promise.all([
      sendEmail(env.RESEND_API_KEY, {
        from: env.CONTACT_FROM_EMAIL,
        to: env.CONTACT_TO_EMAIL,
        reply_to: email,
        subject: `New contact form submission from ${name}`,
        html: `<p><strong>Name:</strong> ${safeName}</p>
<p><strong>Email:</strong> ${safeEmail}</p>
<p><strong>Message:</strong></p>
<p>${safeMessage}</p>`,
        text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
      }),
      sendEmail(env.RESEND_API_KEY, {
        from: env.CONTACT_FROM_EMAIL,
        to: email,
        subject: "Thanks for reaching out to Starburst Digital",
        html: `<p>Hi ${safeName},</p>
<p>Thanks for your message — I've received it and will get back to you within one business day.</p>
<p>For reference, here's what you sent:</p>
<blockquote>${safeMessage}</blockquote>
<p>— Kevin<br>Starburst Digital</p>`,
        text: `Hi ${name},

Thanks for your message — I've received it and will get back to you within one business day.

For reference, here's what you sent:

${message}

— Kevin
Starburst Digital`,
      }),
    ]);
  } catch (err) {
    console.error("Contact form email send failed:", err);
    return redirect(url, "/contact?error=1");
  }

  return redirect(url, "/thanks");
};
