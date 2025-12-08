import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useWatch } from "react-hook-form"
import { toast } from "sonner"
import { useGetBranches } from "@/app/configurations/branches/hooks/useBranchesService"
import { useGetSeriesWithoutGroup } from "@/app/configurations/series/hooks/useSeriesService"
import { Button } from "@/components/ui/button"
import { FormWrapper } from "@/shared/components/form/form-wrapper"
import { InputForm } from "@/shared/components/form/input-form"
import { MultiSelectForm } from "@/shared/components/form/multi-select-form"
import Modal from "@/shared/components/ui/modal"
import { useFormChanges } from "@/shared/hooks/useFormChanges"
import { dataToMulti } from "@/shared/lib/multi-select"
import { useModalStore } from "@/shared/store/modal.store"
import { useEditUser } from "../../hooks/useUsersService"
import { EditUser, editUserSchema } from "../../schemas/users.schema"
import { User } from "../../types/users.type"

export default function ModalEditUser() {
  const {
    id,
    UserLocals: locals,
    employee: { firstName },
    username,
    cardNumber,
    userSeries,
  } = useModalStore((state) => state.openModals).find(
    (modal) => modal.id === "modal-edit-user",
  )?.prop as User

  const editUser = useEditUser()
  const branchesQuery = useGetBranches()
  const { getChangedFields } = useFormChanges<EditUser>()

  const form = useForm<EditUser>({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      firstName,
      username,
      cardNumber,
      localIds: locals?.map((local) => local.local.idLocal) || [],
      serieIds: userSeries?.map((userSerie) => userSerie.serie.id) || [],
    },
  })

  const selectedLocalIds = useWatch({
    control: form.control,
    name: "localIds",
  })

  const series = useGetSeriesWithoutGroup(selectedLocalIds)

  const handleEdit = (formData: EditUser) => {
    const changedFields = getChangedFields(formData, {
      firstName,
      username,
      cardNumber,
      localIds: locals?.map((local) => local.local.idLocal) || [],
      serieIds: userSeries?.map((userSerie) => userSerie.serie.id) || [],
    })
    if (Object.keys(changedFields).length !== 0) {
      return editUser.mutate({
        id,
        body: changedFields,
      })
    }
    toast.info("No se realizaron cambios")
    useModalStore.getState().closeModal("modal-edit-user")
  }

  return (
    <Modal
      modalId="modal-edit-user"
      title="Editar usuario"
      className="overflow-y-auto sm:w-[400px]"
      scrollable={true}
    >
      <FormWrapper form={form} onSubmit={handleEdit}>
        <InputForm label="Nombre" name="firstName" />
        <InputForm label="Nombre de usuario" name="username" />
        <InputForm
          label="Nº Tarjeta"
          name="cardNumber"
          placeholder="Ej. 12345678"
        />
        <MultiSelectForm
          label="Sedes"
          name="localIds"
          options={dataToMulti(branchesQuery.data, "idLocal", "localName")}
        />
        <MultiSelectForm
          label="Series"
          options={dataToMulti(series.data, "id", "seriesNumber")}
          name="serieIds"
          disabled={series.isLoading || !series.data?.length}
          placeholder={
            !series.data?.length ? "No hay series en este local" : undefined
          }
        />
        <Modal.Footer>
          <Button type="submit" variant="outline">
            Guardar
          </Button>
        </Modal.Footer>
      </FormWrapper>
    </Modal>
  )
}
