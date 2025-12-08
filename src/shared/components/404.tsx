import { Image } from "@unpic/react"
import { Card } from "@/components/ui/card"

export const NotFound = () => {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Card className="flex w-fit flex-row items-center justify-center gap-3 border-gray-100 px-10 text-red-500">
        <div className="flex flex-col items-center justify-center gap-8">
          <h1 className="font-bold text-9xl">404</h1>
          <p className="text-2xl">La página que buscas no existe</p>
        </div>
        <Image src="/img/404.webp" alt="404" width={400} height={400} />
      </Card>
    </div>
  )
}
