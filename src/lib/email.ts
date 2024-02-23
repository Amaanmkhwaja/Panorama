import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const domain = process.env.NEXT_PUBLIC_URL_EMAIL;

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const confirmLink = `${domain}/agency/auth/new-password?token=${token}`;

  await resend.emails.send({
    from: "Panorama <no-reply@mannytechlabs.com>",
    to: email,
    reply_to: "manny.sotoruiz@mannytechlabs.com",
    subject: "Reset your password",
    html: `<p>Click <a href="${confirmLink}">here</a> to reset your password.</p>`,
  });
};

export const sendVerificationEmail = async (email: string, code: string) => {
  // const confirmLink = `${domain}/agency/auth/new-verification?token=${token}`;

  await resend.emails.send({
    from: "Panorama <no-reply@mannytechlabs.com>",
    to: email,
    reply_to: "manny.sotoruiz@mannytechlabs.com",
    subject: "Please confirm your email",
    html: `<p>Use this code to verify your account: ${code}</p>`,
    // html: `<p>Click <a href="${confirmLink}">here</a> to confirm your email for AO Capital Investments.</p>`,
  });
};
