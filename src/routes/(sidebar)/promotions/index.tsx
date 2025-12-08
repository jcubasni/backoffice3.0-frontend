// src/routes/(sidebar)/promotions/index.tsx

import { createFileRoute } from '@tanstack/react-router'
import { HeaderContent } from "@/shared/components/header-content"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Routes } from "@/shared/lib/routes"
import Promotions from "@/app/promotions/components/promotion/promotions"

export const Route = createFileRoute('/(sidebar)/promotions/')({
  component: RouteComponent,
  staticData: {
    headerTitle: 'Promociones',
  },
})

function RouteComponent() {
  const navigate = Route.useNavigate()

  return (
    <>
      <HeaderContent>
        <HeaderContent.Right>
          <Button
            onClick={() => navigate({ to: Routes.NewPromotion })}
          >
            <Plus /> Nueva Promoción
          </Button>
        </HeaderContent.Right>
      </HeaderContent>
      
      <Promotions />
    </>
  )
}