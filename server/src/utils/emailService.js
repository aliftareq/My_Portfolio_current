import { resend } from "../config/resend.js";

export const sendEmail = async ({ to, subject, html, replyTo }) => {
  const { data, error } = await resend.emails.send({
    from: "Portfolio <onboarding@resend.dev>",
    to: Array.isArray(to) ? to : [to],
    subject,
    html,
    ...(replyTo ? { replyTo } : {}),
  });

  if (error) {
    console.error("Resend error:", error);
    throw new Error(error.message || "Email failed to send");
  }

  return data;
};
