import { SignInForm } from "./sign-in-form"

export default function Page() {
  return (
    <div>
      <section className="border border-zinc-300 max-w-md mx-auto my-16 px-6 pt-16 pb-8 rounded-md">
        <p className="font-semibold text-center text-2xl mb-2">Sign in</p>
        <p className="text-muted-foreground text-center text-sm text-zinc-500 mb-4">
          Enter your credentials below to sign in.
        </p>
        <SignInForm />
      </section>
    </div>
  )
}
