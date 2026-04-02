import { sendEmail } from "../utils/emailService.js";

export const sendEmailController = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, service, message } = req.body;

    if (!firstName || !email || !message) {
      return res.status(400).json({
        message: "First name, email and message are required",
      });
    }

    const subject = `New Contact Message${service ? ` - ${service}` : ""}`;

    const html = `
  <div style="margin:0; padding:0; background-color:#0f172a; font-family: Arial, sans-serif;">
    
    <div style="max-width:600px; margin:40px auto; background:#1e293b; border-radius:12px; overflow:hidden; box-shadow:0 10px 30px rgba(0,0,0,0.3);">
      
      <!-- Header -->
      <div style="background:linear-gradient(135deg,#06b6d4,#22c55e); padding:20px 30px;">
        <h2 style="margin:0; color:#fff; font-size:22px;">
          📩 New Contact Message
        </h2>
      </div>

      <!-- Body -->
      <div style="padding:30px; color:#e2e8f0;">
        
        <p style="margin-bottom:20px; font-size:14px; color:#94a3b8;">
          You received a new message from your portfolio contact form.
        </p>

        <!-- Info Table -->
        <table style="width:100%; border-collapse:collapse; font-size:14px;">
          <tr>
            <td style="padding:8px 0; color:#94a3b8;">First Name</td>
            <td style="padding:8px 0; font-weight:600;">${firstName}</td>
          </tr>
          <tr>
            <td style="padding:8px 0; color:#94a3b8;">Last Name</td>
            <td style="padding:8px 0; font-weight:600;">${lastName || "N/A"}</td>
          </tr>
          <tr>
            <td style="padding:8px 0; color:#94a3b8;">Email</td>
            <td style="padding:8px 0; font-weight:600;">${email}</td>
          </tr>
          <tr>
            <td style="padding:8px 0; color:#94a3b8;">Phone</td>
            <td style="padding:8px 0; font-weight:600;">${phone || "N/A"}</td>
          </tr>
          <tr>
            <td style="padding:8px 0; color:#94a3b8;">Service</td>
            <td style="padding:8px 0; font-weight:600;">${service || "N/A"}</td>
          </tr>
        </table>

        <!-- Message Box -->
        <div style="margin-top:25px; padding:20px; background:#020617; border-radius:8px; border:1px solid #334155;">
          <p style="margin:0 0 10px 0; color:#94a3b8; font-size:13px;">Message</p>
          <p style="margin:0; color:#f1f5f9; line-height:1.6;">
            ${message}
          </p>
        </div>

      </div>

      <!-- Footer -->
      <div style="padding:15px 30px; background:#020617; text-align:center; font-size:12px; color:#64748b;">
        This message was sent from your portfolio contact form.
      </div>

    </div>

  </div>
`;

    await sendEmail({
      to: "alifhossen3721@gmail.com",
      subject,
      html,
      replyTo: email,
    });

    return res.status(200).json({
      message: "Email sent successfully",
    });
  } catch (error) {
    console.error("Email sending error:", error);
    return res.status(500).json({
      message: error.message || "Internal server error",
    });
  }
};
