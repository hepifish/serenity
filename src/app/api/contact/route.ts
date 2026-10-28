import { NextResponse } from "next/server";
import { z } from "zod";
import { sendContactMessage } from "@/lib/email";
import { oneLine } from "@/lib/format";
import { rateLimited } from "@/lib/rate-limit";

const Body = z.object({
  name: z.string().trim().min(2).max(120).transform(oneLine),
  email: z.string().trim().email().max(200),
  message: z.string().trim().min(5).max(3000),
  lang: z.enum(["en", "ro", "de"]),
  website: z.string().max(0).optional(),
});

export async function POST(req: Request) {
  const limited = await rateLimited(req, "contact", 5, 600);
  if (limited) return limited;
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid" }, { status: 400 });
  await sendContactMessage(parsed.data);
  return NextResponse.json({ ok: true });
}
