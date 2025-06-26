import { Context } from "./context";

export function requireRole(context: Context, roles: string[]): void {
  const { user } = context;

  if (!user || !roles.includes(user.role)) {
    throw new Error("Unauthorized");
  }
}
