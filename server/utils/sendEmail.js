import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true, // false for 587, true for 465
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  // This bypasses local certificate issues
  tls: {
    rejectUnauthorized: false,
  },
  connectionTimeout: 10000, // 10 seconds
});

console.log("Checking connection to AbegFix Mail Server...");

transporter.verify((error, success) => {
  if (error) {
    console.log("❌ Connection Failed!");
    console.error(error);
  } else {
    console.log("✅ Server is ready to take our messages!");
  }
});
const sendEmail = async (to, subject, html) => {
  await transporter.sendMail({
    from: `"Abeg Fix" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html,
  });
};

export default sendEmail;
