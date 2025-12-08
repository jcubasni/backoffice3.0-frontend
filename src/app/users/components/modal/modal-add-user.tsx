import { zodResolver } from "@hookform/resolvers/zod"
import { Eye, EyeOff } from "lucide-react"
import { useState } from "react"
import { useForm, useWatch } from "react-hook-form"
import { useGetBranches } from "@/app/configurations/branches/hooks/useBranchesService"
import { useGetSeriesWithoutGroup } from "@/app/configurations/series/hooks/useSeriesService"
import { Button } from "@/components/ui/button"
import { FormWrapper } from "@/shared/components/form/form-wrapper"
import { InputForm } from "@/shared/components/form/input-form"
import { MultiSelectForm } from "@/shared/components/form/multi-select-form"
import Modal from "@/shared/components/ui/modal"
import { dataToMulti } from "@/shared/lib/multi-select"
import { useModalStore } from "@/shared/store/modal.store"
import { useAddUser } from "../../hooks/useUsersService"
import { addUserSchema } from "../../schemas/users.schema"
import { AddUserDTO } from "../../types/users.type"

export default function ModalAddUser() {
  const [password, setPassword] = useState<"password" | "text">("password")
  const { closeModal } = useModalStore()
  const addUser = useAddUser()
  const branchesQuery = useGetBranches()

  const form = useForm<AddUserDTO>({
    resolver: zodResolver(addUserSchema),
  })

  const selectedLocalIds = useWatch({
    control: form.control,
    name: "localIds",
  })
  const series = useGetSeriesWithoutGroup(selectedLocalIds)

  const handleSave = (data: AddUserDTO) => {
    addUser.mutate(data)
  }

  return (
    <Modal
      modalId="modal-add-user"
      title="Agregar usuario"
      className="sm:w-[400px]"
    >
      <FormWrapper form={form} onSubmit={handleSave}>
        <InputForm label="Nombre" name="firstName" />
        <InputForm label="Nombre de usuario" name="username" />
        <InputForm
          label="Contraseña"
          name="password"
          type={password}
          icon={password === "password" ? Eye : EyeOff}
          iconClick={() =>
            setPassword(password === "password" ? "text" : "password")
          }
        />
        <InputForm label="Nº Tarjeta" name="cardNumber" />
        <MultiSelectForm
          label="Sedes"
          options={dataToMulti(branchesQuery.data, "idLocal", "localName")}
          name="localIds"
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
        <Modal.Footer className="grid-cols-2">
          <Button variant="outline">Guardar</Button>
          <Button type="button" onClick={() => closeModal("modal-add-user")}>
            Cancelar
          </Button>
        </Modal.Footer>
      </FormWrapper>
    </Modal>
  )
}
