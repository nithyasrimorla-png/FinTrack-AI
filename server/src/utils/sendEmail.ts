import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  connectionTimeout: 30000,
});

export const sendResetEmail = async (
  email: string,
  token: string
) => {
  console.log("CLIENT_URL:", process.env.CLIENT_URL);
  console.log("EMAIL_USER:", process.env.EMAIL_USER);
  console.log("Sending email to:", email);

  const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${token}`;

  console.log("Reset Link:", resetLink);

  try {
    const info = await transporter.sendMail({
      from: `"FinTrack AI" <nithyamorla18@gmail.com>`,
      to: email,
      subject: "Reset Your FinTrack AI Password",
      html: `
        <h2>Forgot your password?</h2>

        <p>Click below to reset it.</p>

        <a href="${resetLink}">
          Reset Password
        </a>

        <p>This link expires in 15 minutes.</p>
      `,
    });

    console.log("Email sent successfully!");
    console.log(info);

  } catch (err) {
    console.error(" EMAIL ERROR:", err);
    throw err;
  }
};