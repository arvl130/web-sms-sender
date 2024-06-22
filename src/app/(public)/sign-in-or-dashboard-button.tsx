import { Button, buttonVariants } from "@/components/shadcn/ui/button"
import { validateSessionWithCookies } from "@/server/auth"
import { cn } from "@/utils/shadcn"
import Link from "next/link"

export function SkeletonSignInOrDashboardLink() {
  return (
    <Button variant="default" className="w-28 mr-3" disabled>
      ...
    </Button>
  )
}

export async function SignInOrDashboardLink() {
  const { user } = await validateSessionWithCookies()

  if (user === null)
    return (
      <Link
        href="/sign-in"
        className={cn(
          buttonVariants({
            variant: "default",
          }),
          "w-28 mr-3"
        )}
      >
        Sign in
      </Link>
    )

  return (
    <Link
      href="/dashboard"
      className={cn(
        buttonVariants({
          variant: "default",
        }),
        "w-28 mr-3"
      )}
    >
      Dashboard
    </Link>
  )
}
