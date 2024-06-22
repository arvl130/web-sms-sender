import { generateId } from "lucia"

export function generateUserId() {
  return generateId(28)
}
