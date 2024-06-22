import { Button, buttonVariants } from "@/components/shadcn/ui/button"
import { cn } from "@/utils/shadcn"
import Link from "next/link"

export default function Home() {
  return (
    <div className="flex flex-grow flex-col justify-center items-center px-3">
      <section className="text-center">
        <p className="mb-3 text-5xl font-bold">The fastest way to send SMS</p>
        <p className="mb-6">
          Setup SMS notifications in minutes. Manage without headaches.
        </p>

        <Link
          href="/sign-in"
          className={cn(
            buttonVariants({
              variant: "default",
            }),
            "mr-3"
          )}
        >
          Get started
        </Link>
        <a
          href="https://www.ageulin.com/#contact"
          className={buttonVariants({
            variant: "outline",
          })}
        >
          Contact Owner
        </a>
      </section>
    </div>
  )
}
