import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "supersecretkey";

export function verifyToken(token: string) {
  try {
    const decoded = jwt.verify(token, SECRET);
    return decoded as { userId: string; email: string; role: string };
  } catch (err) {
    console.error("Token verification failed:", err);
    return null;
  }
}
