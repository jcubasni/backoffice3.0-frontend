import { zodResolver } from "@hookform/resolvers/zod"
import { createFileRoute } from "@tanstack/react-router"
import { useForm } from "react-hook-form"
import { BillingNoteForm } from "@/app/billing-notes/components/note-form"
import { TableBillingNotes } from "@/app/billing-notes/components/table-billing-notes"
import { useAddNote } from "@/app/billing-notes/hooks/useNote"
import {
  BillingNoteSchema,
  billingNoteSchema,
} from "@/app/billing-notes/schemas/note.schema"
import { FormWrapper } from "@/shared/components/form/form-wrapper"

export const Route = createFileRoute("/(sidebar)/billing-notes/new")({
  component: RouteComponent,
  staticData: {
    headerTitle: "Nueva Nota",
  },
})

function RouteComponent() {
  const form = useForm<BillingNoteSchema>({
    resolver: zodResolver(billingNoteSchema),
  })

  const handleSuccess = () => {
    form.reset()
  }

  const { onSubmit, isPending } = useAddNote(handleSuccess)

  return (
    <FormWrapper form={form} onSubmit={onSubmit} className="flex flex-1">
      <BillingNoteForm />
      <TableBillingNotes isPending={isPending} />
    </FormWrapper>
  )
}
