"use server";

import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { prisma } from "@/app/lib/prisma";
import { createSession, deleteSession } from "@/app/lib/session";

export type AuthState =
  | { errors?: { name?: string[]; email?: string[]; password?: string[] }; message?: string }
  | undefined;

export async function signup(state: AuthState, formData: FormData): Promise<AuthState> {
  const name = (formData.get("name") as string)?.trim();
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const password = formData.get("password") as string;

  const errors: Record<string, string[]> = {};
  if (!name || name.length < 2) errors.name = ["Name must be at least 2 characters."];
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = ["Please enter a valid email."];
  if (!password || password.length < 8) errors.password = ["Password must be at least 8 characters."];

  if (Object.keys(errors).length) return { errors };

  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return { errors: { email: ["An account with this email already exists."] } };

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({ data: { name, email, passwordHash } });

    await createSession({ id: user.id, email: user.email, name: user.name, plan: user.plan });
  } catch {
    return { message: "Something went wrong. Please try again." };
  }

  redirect("/");
}

export async function login(state: AuthState, formData: FormData): Promise<AuthState> {
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const password = formData.get("password") as string;

  if (!email || !password) return { message: "Email and password are required." };

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return { message: "Invalid email or password." };

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return { message: "Invalid email or password." };

    await createSession({ id: user.id, email: user.email, name: user.name, plan: user.plan });
  } catch {
    return { message: "Something went wrong. Please try again." };
  }

  redirect("/");
}

export async function logout() {
  await deleteSession();
  redirect("/login");
}
