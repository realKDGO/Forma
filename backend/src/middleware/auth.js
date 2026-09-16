import { createClient } from "@supabase/supabase-js";
import { prisma } from "../config/prisma.js";
const supabase = () =>
  createClient(process.env.SUPABASE_URL, process.env.SUPABASE_PUBLISHABLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
export async function requireAuth(req, res, next) {
  try {
    const token = req.headers.authorization?.match(/^Bearer (.+)$/)?.[1];
    if (!token)
      return res
        .status(401)
        .json({
          error: { code: "UNAUTHENTICATED", message: "Please log in." },
        });
    const { data, error } = await supabase().auth.getUser(token);
    if (error || !data.user)
      return res
        .status(401)
        .json({
          error: {
            code: "INVALID_SESSION",
            message: "Your session is no longer valid.",
          },
        });
    req.user = { id: data.user.id, email: data.user.email };
    await prisma.user.upsert({
      where: { id: req.user.id },
      create: { id: req.user.id, email: req.user.email },
      update: { email: req.user.email },
    });
    next();
  } catch (e) {
    next(e);
  }
}
