import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendResetEmail = async (
  email: string,
  token: string
) => {
  const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${token}`;

  console.log("Sending email to:", email);
  console.log("Reset Link:", resetLink);

  const info = await transporter.sendMail({
    from: `"FinTrack AI" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Reset Your FinTrack AI Password",
    html: `
      <h2>Forgot your password?</h2>
      <p>Click the button below to reset it.</p>

      <a href="${resetLink}"
         style="
           padding:12px 20px;
           background:#06b6d4;
           color:white;
           text-decoration:none;
           border-radius:8px;
         ">
         Reset Password
      </a>

      <p>This link expires in 15 minutes.</p>
    `,
  });

  console.log("Email sent successfully!");
  console.log(info);
};