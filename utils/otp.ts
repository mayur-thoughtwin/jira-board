export const generateOtpCodeWithExpiry = (validMinutes = 5): { otp: string; expiresAt: Date } => {
  const otp = Math.floor(1000 + Math.random() * 9000).toString();
  const expiresAt = new Date(Date.now() + validMinutes * 60 * 1000);
  return { otp, expiresAt };
};
