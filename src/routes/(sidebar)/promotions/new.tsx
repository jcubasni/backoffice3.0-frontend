import { createFileRoute } from '@tanstack/react-router'
import FormPromotion from '@/app/promotions/components/form-promotion'

export const Route = createFileRoute('/(sidebar)/promotions/new')({
  component: RouteComponent,
  staticData: { headerTitle: 'Nueva Promocion' },
})

function RouteComponent() {
  return (
    <>
    <FormPromotion/>
    </>
  )
}
