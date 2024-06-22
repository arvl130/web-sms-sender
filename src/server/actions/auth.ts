"use server"

import { z } from "zod"
import { ActionError, safeActionClient } from "../safe-action"
import { Scrypt } from "lucia"
import { generateUserId } from "@/utils/uuid"
import { prisma } from "../db"
import {
  createSessionForUserId,
  invalidateSessionById,
  validateSessionWithCookies,
} from "../auth"
import { redirect } from "next/navigation"

export const signUpWithEmailAndPasswordAction = safeActionClient
  .schema(
    z.object({
      email: z
        .string()
        .min(1, {
          message: "Please enter your email.",
        })
        .email({
          message: "This email has an invalid format.",
        }),
      password: z.string().min(1, {
        message: "Please enter your password.",
      }),
    })
  )
  .action(async ({ parsedInput }) => {
    const scrypt = new Scrypt()
    const hashedPassword = await scrypt.hash(parsedInput.password)
    const userId = generateUserId()

    await prisma.user.create({
      data: {
        id: userId,
        email: parsedInput.email,
        passwordHash: hashedPassword,
      },
    })

    await createSessionForUserId(userId)
    redirect("/sign-in")
  })

export const signInWithEmailAndPasswordAction = safeActionClient
  .schema(
    z.object({
      email: z
        .string()
        .min(1, {
          message: "Please enter your email.",
        })
        .email({
          message: "This email has an invalid format.",
        }),
      password: z.string().min(1, {
        message: "Please enter your password.",
      }),
    })
  )
  .action(async ({ parsedInput }) => {
    const user = await prisma.user.findUnique({
      where: {
        email: parsedInput.email,
      },
    })

    if (user === null) throw new ActionError("Invalid email or password.")

    const passwordIsValid = await new Scrypt().verify(
      user.passwordHash,
      parsedInput.password
    )

    if (!passwordIsValid) throw new ActionError("Incorrect email or password.")

    await createSessionForUserId(user.id)
    redirect("/dashboard")
  })

export const signOutAction = safeActionClient.action(async () => {
  const { session } = await validateSessionWithCookies()
  if (!session) throw new ActionError("Unauthorized.")

  await invalidateSessionById(session.id)
  redirect("/sign-in")
})
