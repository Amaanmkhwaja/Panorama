import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const domain = process.env.NEXT_PUBLIC_URL;

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const confirmLink = `${domain}/agency/auth/new-password?token=${token}`;

  await resend.emails.send({
    from: "MannyTech Labs <no-reply@mannytechlabs.com>",
    to: email,
    reply_to: "manny.sotoruiz@mannytechlabs.com",
    subject: "Reset your password",
    html: `<p>Click <a href="${confirmLink}">here</a> to reset your password.</p>`,
  });
};

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `${domain}/agency/auth/new-verification?token=${token}`;

  await resend.emails.send({
    from: "MannyTech Labs <no-reply@mannytechlabs.com>",
    to: email,
    reply_to: "manny.sotoruiz@mannytechlabs.com",
    subject: "Please confirm your email",
    html: `<p>Click <a href="${confirmLink}">here</a> to confirm your email for AO Capital Investments.</p>`,
  });
};
