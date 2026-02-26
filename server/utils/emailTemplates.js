export const welcomeTemplate = (firstName, otp, role) => `
<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden;">
  <div style="background-color: #1E3A8A; padding: 30px; text-align: center;">
    <h1 style="color: white; margin: 0; font-size: 24px; letter-spacing: 2px;">ABEG FIX</h1>
  </div>
  <div style="padding: 40px 20px; color: #334155; line-height: 1.6;">
    <h2 style="color: #1E3A8A;">Confirm your registration</h2>
    <p>Hello <b>${firstName}</b>,</p>
    <p>Thank you for joining Abeg Fix as a <b>${role}</b>. To secure your account and verify your email, please use the code below:</p>

    <div style="background: #f8fafc; border: 2px dashed #cbd5e1; padding: 20px; text-align: center; margin: 30px 0; border-radius: 12px;">
      <span style="font-size: 32px; font-weight: 900; letter-spacing: 8px; color: #1E3A8A;">${otp}</span>
    </div>

    <p style="font-size: 14px;">This code is valid for <b>10 minutes</b>. If you did not sign up for an Abeg Fix account, please ignore this email.</p>
  </div>
  <div style="background-color: #f1f5f9; padding: 20px; text-align: center; font-size: 12px; color: #64748b;">
    &copy; 2026 Abeg Fix. Reliable Artisans across Lagos.
  </div>
</div>
`;

export const resetTemplate = (resetUrl) => `
<div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
  <h2 style="color: #1E3A8A;">Reset Your Password</h2>
  <p>You requested a password reset. Click the button below to choose a new one:</p>
  <div style="text-align: center; margin: 30px 0;">
    <a href="${resetUrl}" style="background: #1E3A8A; color: white; padding: 15px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; text-transform: uppercase; font-size: 14px;">Reset Password</a>
  </div>
  <p style="font-size: 12px; color: #666;">If you didn't request this, please ignore this email. The link is valid for 1 hour.</p>
</div>
`;
