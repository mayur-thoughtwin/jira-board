import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "supersecretkey";

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, SECRET) as {
      userId: string;
      email: string;
      role: string;
    };
  } catch {
    return null;
  }
};
