import { Button } from "@/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import Modal from "@/shared/components/ui/modal"
import { useModalStore } from "@/shared/store/modal.store"
import { Modals } from "../../lib/product-modals-name"

export default function ModalEditProducts() {
  const dataModal = useModalStore((state) =>
    state.openModals.find((modal) => modal.id === Modals.EDIT_PRODUCT),
  )?.prop

  return (
    <Modal
      modalId={Modals.EDIT_PRODUCT}
      title="Editar producto"
      className="sm:w-[450px]"
    >
      <form className="space-y-4">
        <Input
          label="Nombre"
          defaultValue={dataModal?.name ?? ""}
          placeholder="Nombre del producto"
        />
        <Input
          label="Código"
          defaultValue={dataModal?.productCode ?? ""}
          placeholder="Código del producto"
        />
        <Input
          label="Precio"
          type="number"
          defaultValue={dataModal?.price ?? ""}
          placeholder="Precio"
        />
        <Input
          label="Stock"
          type="number"
          defaultValue={dataModal?.stock ?? ""}
          placeholder="Stock disponible"
        />
        <Input
          label="Unidad"
          defaultValue={dataModal?.measurementUnit ?? ""}
          placeholder="Ej: litros, unidades"
        />
        <Input
          label="Grupo"
          defaultValue={dataModal?.group ?? ""}
          placeholder="Código o nombre del grupo"
        />
        <Input
          label="Estado"
          defaultValue={dataModal?.state === 1 ? "Activo" : "Inactivo"}
          placeholder="1 = Activo, 0 = Inactivo"
        />

        <div className="pt-2">
          <Button type="submit" variant="outline" className="w-full">
            Guardar
          </Button>
        </div>
      </form>
    </Modal>
  )
}
