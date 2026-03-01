import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

// Initialize with your API Key
const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async (to, subject, html) => {
  try {
    const { data, error } = await resend.emails.send({
      from: "Abeg Fix <support@abegfix.com>", // Ensure this matches your verified domain
      to: [to],
      subject: subject,
      html: html,
    });

    if (error) {
      console.error("Resend internal error:", error);
      throw new Error(error.message);
    }

    //console.log("✅ Email sent successfully via Resend API:", data.id);
    return data;
  } catch (err) {
    console.error("Failed to send email through Resend:", err.message);
    throw err;
  }
};
