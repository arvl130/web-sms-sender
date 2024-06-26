import { buttonVariants } from "@/components/shadcn/ui/button"
import { Suspense } from "react"
import {
  SignInOrDashboardLink,
  SkeletonSignInOrDashboardLink,
} from "./sign-in-or-dashboard-button"
import Link from "next/link"

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <main className="min-h-dvh flex flex-col">
      <header className="border-b border-zinc-300 h-14 px-3">
        <div className="max-w-6xl mx-auto h-full flex items-center justify-between">
          <Link href="/">
            <h1 className="font-semibold">Web SMS Sender</h1>
          </Link>

          <div>
            <Suspense fallback={<SkeletonSignInOrDashboardLink />}>
              <SignInOrDashboardLink />
            </Suspense>

            <a
              href="https://www.ageulin.com/#contact"
              className={buttonVariants({
                variant: "outline",
              })}
            >
              Contact Owner
            </a>
          </div>
        </div>
      </header>
      <div className="flex flex-col flex-grow">{children}</div>
      <footer className="bg-zinc-800 flex justify-center">
        <p className="text-white text-sm px-4 py-4 font-medium">
          Angelo Geulin &copy; 2024
        </p>
      </footer>
    </main>
  )
}
