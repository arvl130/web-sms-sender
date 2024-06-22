"use client"

import { Loader2 } from "lucide-react"
import { Button } from "@/components/shadcn/ui/button"
import { signOutAction } from "@/server/actions/auth"
import { useAction } from "next-safe-action/hooks"
import toast from "react-hot-toast"

export function LogoutButton() {
  const { execute, status } = useAction(signOutAction, {
    onError: ({ error }) => {
      if (error.serverError) toast.error(error.serverError)
    },
  })

  return (
    <Button
      type="button"
      onClick={() => {
        execute()
      }}
      disabled={status === "executing"}
    >
      {status === "executing" && (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      )}
      Logout
    </Button>
  )
}
