import nodemailer from "nodemailer";

type ContactPayload = {
  name: string;
  email: string;
  phoneNumber?: string | null;
  service?: string | null;
  inquiry: string;
  createdAt: Date;
};

function notifyRecipients(): string[] {
  const raw = process.env.CONTACT_NOTIFY_EMAILS ?? "";
  return raw
    .split(",")
    .map((email) => email.trim())
    .filter(Boolean);
}

function formatSubmittedAt(date: Date): string {
  const timeZone =
    process.env.CONTACT_NOTIFY_TIMEZONE?.trim() || "Asia/Riyadh";

  return new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone,
    timeZoneName: "short",
  }).format(date);
}

export function smtpConfigured(): boolean {
  return Boolean(
    process.env.SMTP_HOST?.trim() &&
      process.env.SMTP_USER?.trim() &&
      process.env.SMTP_PASS?.trim() &&
      notifyRecipients().length > 0
  );
}

export async function sendContactNotification(
  submission: ContactPayload
): Promise<void> {
  if (!smtpConfigured()) {
    // eslint-disable-next-line no-console
    console.warn("SMTP not configured; skipping contact notification email.");
    return;
  }

  const port = Number(process.env.SMTP_PORT ?? 587);
  const secure =
    process.env.SMTP_SECURE === "true" || process.env.SMTP_SECURE === "1";

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const from =
    process.env.SMTP_FROM?.trim() ||
    `"Tikram Arabia" <${process.env.SMTP_USER}>`;

  const dashboardUrl =
    process.env.ADMIN_DASHBOARD_URL?.trim() ||
    "https://dashboard.tikramarabia.com";

  const lines = [
    "A new contact form message was submitted on Tikram Arabia.",
    "",
    "Please check the admin dashboard for the full details.",
    `Dashboard: ${dashboardUrl}`,
    "",
    "--- Submission preview ---",
    `Name: ${submission.name}`,
    `Email: ${submission.email}`,
    `Phone: ${submission.phoneNumber || "—"}`,
    `Service: ${submission.service || "—"}`,
    `Submitted: ${formatSubmittedAt(submission.createdAt)}`,
    "",
    "Message:",
    submission.inquiry,
  ];

  await transporter.sendMail({
    from,
    to: notifyRecipients(),
    subject: "New contact form submission — Tikram Arabia",
    text: lines.join("\n"),
  });
}
