import { validateSessionWithCookies } from "@/server/auth"
import { LogoutButton } from "./logout-button"

export default async function Page() {
  const { user } = await validateSessionWithCookies()

  if (user === null) return <p>Unauthorized</p>

  return <LogoutButton />
}
