import { sendEmail } from "../utils/emailService.js";

export const sendEmailController = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    await sendEmail({
      to: email,
      subject: "Welcome!",
      html: "<p>Your email was sent successfully 🚀</p>",
    });

    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to send email" });
  }
};
