import type { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../../config/prisma";
import { ok, fail } from "../../utils/response";
import { env } from "../../config/env";
import type { SignupInput, LoginInput } from "./auth.schema";

export async function signup(req: Request, res: Response, next: NextFunction) {
  try {
    const body = req.body as SignupInput;

    const existing = await prisma.user.findUnique({
      where: { email: body.email },
      select: { id: true },
    });

    if (existing) {
      return res.status(409).json(fail("Conflict", ["Email already exists"]));
    }

    const passwordHash = await bcrypt.hash(body.password, 12);

    const user = await prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        password: passwordHash,
        role: body.role,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    return res.status(201).json(ok("Signup successful", user));
  } catch (err: any) {
    if (err?.code === "P2002") {
      return res.status(409).json(fail("Conflict", ["Email already exists"]));
    }
    return next(err);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const body = req.body as LoginInput;

    const user = await prisma.user.findUnique({
      where: { email: body.email },
      select: { id: true, email: true, password: true, role: true, name: true },
    });

    if (!user) {
      return res.status(401).json(fail("Unauthorized", ["Invalid credentials"]));
    }

    const passwordOk = await bcrypt.compare(body.password, user.password);
    if (!passwordOk) {
      return res.status(401).json(fail("Unauthorized", ["Invalid credentials"]));
    }

    const token = jwt.sign(
  { role: user.role },
  env.JWT_SECRET,
  {
    subject: user.id,
    expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"],
  }
);

    return res.status(200).json(
      ok("Login successful", {
        token,
        user: { id: user.id, email: user.email, name: user.name, role: user.role },
      })
    );
  } catch (err) {
    return next(err);
  }
}