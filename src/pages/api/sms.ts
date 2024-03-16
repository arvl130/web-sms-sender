import type { NextApiRequest, NextApiResponse } from "next"
import { SNSClient, PublishCommand } from "@aws-sdk/client-sns"
import { z, ZodError } from "zod"
import { prisma } from "@/server/db"

const InputSchema = z.object({
  to: z.string().min(1).max(15),
  body: z.string().min(1).max(160),
  apiKey: z.string().min(1),
  gateway: z.union([z.literal("sns"), z.literal("semaphore")]).optional(),
})

const EnvironmentSchema = z.object({
  AWS_ACCESS_KEY_ID: z.string().min(1),
  AWS_ACCESS_KEY_SECRET: z.string().min(1),
  AWS_REGION: z.string().min(1),
  SEMAPHORE_API_URL: z.string().min(1).url(),
  SEMAPHORE_API_KEY: z.string().min(1),
  IS_MAINTENANCE: z.literal("1").optional(),
})

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<
    | {
        message: string
        to: string
        body: string
      }
    | {
        message: string
        error: unknown
      }
  >
) {
  try {
    const {
      AWS_ACCESS_KEY_ID,
      AWS_ACCESS_KEY_SECRET,
      AWS_REGION,
      IS_MAINTENANCE,
      SEMAPHORE_API_URL,
      SEMAPHORE_API_KEY,
    } = EnvironmentSchema.parse({
      AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
      AWS_ACCESS_KEY_SECRET: process.env.AWS_ACCESS_KEY_SECRET,
      AWS_REGION: process.env.AWS_REGION,
      IS_MAINTENANCE: process.env.IS_MAINTENANCE,
      SEMAPHORE_API_URL: process.env.SEMAPHORE_API_URL,
      SEMAPHORE_API_KEY: process.env.SEMAPHORE_API_KEY,
    })

    const {
      to,
      body,
      apiKey: key,
      gateway,
    } = InputSchema.parse({
      to: req.body.to,
      body: req.body.body,
      apiKey: req.query.apiKey,
    })

    const apiKey = await prisma.apiKey.findUnique({
      where: {
        key,
      },
    })

    if (!apiKey) throw new Error("Invalid API key")

    await prisma.$transaction(async (tx) => {
      const newApiKey = await tx.apiKey.update({
        data: {
          messagesLeft: {
            decrement: 1,
          },
        },
        where: {
          key: apiKey.key,
        },
      })

      if (newApiKey.messagesLeft < 0)
        throw new Error("Message limit for API key exceeded")
    })

    await prisma.message.create({
      data: {
        to,
        body,
        apiKeyKey: key,
      },
    })

    if (IS_MAINTENANCE === undefined) {
      if (gateway === "sns") {
        const snsClient = new SNSClient({
          region: AWS_REGION,
          credentials: {
            accessKeyId: AWS_ACCESS_KEY_ID,
            secretAccessKey: AWS_ACCESS_KEY_SECRET,
          },
        })

        await snsClient.send(
          new PublishCommand({
            Message: body,
            PhoneNumber: to,
          })
        )
      } else {
        const response = await fetch(
          `${SEMAPHORE_API_URL}/messages?apikey=${SEMAPHORE_API_KEY}&number=${encodeURIComponent(
            to
          )}&message=${encodeURIComponent(body)}`
        )

        const json = await response.json()
        if (!response.ok) {
          res
            .status(500)
            .json({ message: "Service error occured", error: json })

          return
        }
      }
    }

    res.json({ message: "Message sent", to, body })
  } catch (e) {
    if (e instanceof ZodError) {
      res.status(400).json({ message: "Validation error occured", error: e })
    } else if (e instanceof Error) {
      res.status(400).json({ message: "Bad request", error: e.message })
    } else {
      res.status(500).json({ message: "Unknown error occured", error: e })
    }
  }
}
