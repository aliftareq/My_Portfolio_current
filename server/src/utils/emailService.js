import { resend } from "../config/resend.js";

export const sendEmail = async ({ to, subject, html }) => {
  try {
    const { data, error } = await resend.emails.send({
      from: "Your App <noreply@yourdomain.com>",
      to: [to],
      subject,
      html,
    });

    if (error) {
      console.error("Resend error:", error);
      throw new Error("Email failed to send");
    }

    return data;
  } catch (err) {
    throw err;
  }
};
