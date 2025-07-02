/* eslint-disable @typescript-eslint/no-explicit-any */
import transporter from "./mailer";

interface EmailData {
  to: string;
  subject: string;
  template: string;
  context: Record<string, any>;
}

export const sendEmail = async ({ to, subject, template, context }: EmailData) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    template: `emails/${template}`,
    context,
  } as any);
};
