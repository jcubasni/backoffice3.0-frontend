"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Search } from "lucide-react"
import { useForm } from "react-hook-form"
import { useGetDocumentTypes } from "@/app/common/hooks/useCommonService"
import { useSearchDocument } from "@/app/common/hooks/useSearchPerson"
import { DocumentTypeCode } from "@/app/common/types/common.type"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ComboBoxForm } from "@/shared/components/form/combo-box-form"
import { FormWrapper } from "@/shared/components/form/form-wrapper"
import { InputForm } from "@/shared/components/form/input-form"
import Modal from "@/shared/components/ui/modal"
import { dataToCombo } from "@/shared/lib/combo-box"
import { Modals } from "../../lib/supplier-modals-name"
import {
  type SupplierSchema,
  supplierSchema,
} from "../../schemas/create-supplier.schema"

export default function ModalAddSupplier() {
  const documentTypes = useGetDocumentTypes()

  const form = useForm<SupplierSchema>({
    resolver: zodResolver(supplierSchema),
  })

  const documentType = form.watch("documentType")
  const documentNumber = form.watch("documentNumber")

  const handleSearchWithValidation = async () => {
    const isValid = await form.trigger(["documentType", "documentNumber"])
    return isValid
  }

  const { handleSearch, handleKeyDown } = useSearchDocument({
    documentType,
    documentNumber,
    shouldValidate: handleSearchWithValidation,
    onSuccess: (data) => {
      const { firstName, lastName, fiscalAddress: address } = data

      // Establecer valores individuales en el formulario
      form.setValue("firstName", firstName)
      form.setValue("lastName", lastName ?? "")
      form.setValue("address", address ?? "")
    },
  })

  const onSubmit = (data: SupplierSchema) => {
    console.log(data)
    // TODO: Implementar lógica de guardado
  }

  return (
    <Modal
      modalId={Modals.ADD_SUPPLIER}
      title="Crear proveedor"
      className="sm:max-w-160"
    >
      <FormWrapper form={form} onSubmit={onSubmit}>
        <div className="flex flex-col gap-4 sm:grid sm:grid-cols-2">
          <ComboBoxForm
            name="documentType"
            label="Tipo de documento"
            className="w-full!"
            options={dataToCombo(documentTypes.data, "id", "name")}
            onSelect={() => form.trigger("documentNumber")}
          />
          <InputForm
            name="documentNumber"
            label="N° documento"
            icon={Search}
            iconClick={handleSearch}
            onKeyDown={handleKeyDown}
          />

          <InputForm
            label={
              documentType !== DocumentTypeCode.RUC ? "Nombres" : "Razón social"
            }
            classContainer={cn(
              documentType !== DocumentTypeCode.RUC
                ? "col-span-1"
                : "col-span-full",
            )}
            name="firstName"
          />
          <InputForm
            label="Apellidos"
            name="lastName"
            classContainer={cn(
              documentType !== DocumentTypeCode.RUC ? "col-span-1" : "hidden",
            )}
          />
          <InputForm
            label="Direccion"
            name="address"
            classContainer="col-span-2"
          />
          <InputForm label="Departamento" name="department" />
          <InputForm label="Provincia" name="province" />
          <InputForm label="Distrito" name="district" />
          <InputForm label="Correo electronico" name="email" />
          <InputForm label="Teléfono" name="phone" />

          <Modal.Footer className="col-span-full">
            <Button type="submit">Guardar</Button>
          </Modal.Footer>
        </div>
      </FormWrapper>
    </Modal>
  )
}
