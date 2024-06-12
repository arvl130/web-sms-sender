import { buttonVariants } from "@/components/shadcn/ui/button"
import { cn } from "@/utils/shadcn"

export default function Home() {
  return (
    <main className="min-h-dvh flex flex-col">
      <header className="border-b border-zinc-300 h-14 px-3">
        <div className="max-w-6xl mx-auto h-full flex items-center justify-between">
          <h1 className="font-semibold">Web SMS Sender</h1>
          <a
            href="https://www.ageulin.com/#contact"
            className={cn(
              buttonVariants({
                variant: "default",
              }),
              "mr-3"
            )}
          >
            Contact Owner
          </a>
        </div>
      </header>
      <main className="flex-grow flex flex-col justify-center items-center px-3">
        <section className="text-center">
          <p className="mb-3 text-5xl font-bold">The fastest way to send SMS</p>
          <p className="mb-6">
            Setup SMS notifications in minutes. Manage it without headaches.
          </p>
          <a
            href="https://www.ageulin.com/#contact"
            className={cn(
              buttonVariants({
                variant: "default",
              }),
              "mr-3"
            )}
          >
            Contact Owner
          </a>
          <a
            href="https://www.google.com"
            className={buttonVariants({
              variant: "outline",
            })}
          >
            Leave
          </a>
        </section>
      </main>
    </main>
  )
}
