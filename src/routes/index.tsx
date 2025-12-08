import { Card } from "@shadcn/card"
import { createFileRoute } from "@tanstack/react-router"
import { FormLogin } from "@/app/auth/components/form-login"

export const Route = createFileRoute("/")({
  component: App,
})

function App() {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Card className="flex h-full w-full flex-col justify-center gap-4 rounded-lg p-6 shadow-lg sm:h-fit sm:w-fit">
        <FormLogin />
      </Card>
    </div>
  )
}
