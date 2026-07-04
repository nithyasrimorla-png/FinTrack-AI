import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendResetEmail = async (
  email: string,
  token: string
) => {
  const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${token}`;

  console.log("Sending email to:", email);
  console.log("Reset Link:", resetLink);

  const { data, error } = await resend.emails.send({
    from: "FinTrack AI <onboarding@resend.dev>",
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

  if (error) {
    console.error("RESEND ERROR:", error);
    throw error;
  }

  console.log("Email sent successfully:", data);
};