import { useFormContext } from "react-hook-form"
import { SyncLoader } from "react-spinners"
import { useShallow } from "zustand/react/shallow"
import { useGetDocumentsForSale } from "@/app/configurations/documents/hooks/useDocumentsService"
import { useClientUtilStore } from "@/app/sales/store/client-util.store"
import { useProductStore } from "@/app/sales/store/product.store"
import { SaleDocumentType } from "@/app/sales/types/sale"
import { Button } from "@/components/ui/button"
import { Colors } from "@/shared/types/constans"

export const DocumentsList = () => {
  const { data } = useGetDocumentsForSale()
  const { resetField, reset } = useFormContext()
  const {
    documentTypeId: selectedType,
    setField,
    resetClientUtil,
  } = useClientUtilStore(
    useShallow((state) => ({
      documentTypeId: state.documentTypeId,
      setField: state.setField,
      resetClientUtil: state.resetClientUtil,
    })),
  )

  return (
    <div className="flex flex-col gap-2">
      <h3 className="font-semibold">Tipo de documento</h3>
      <section className="flex flex-1 gap-2">
        {data ? (
          data.map((document) => (
            <Button
              variant={selectedType === document.id ? "outline" : "default"}
              key={document.id}
              type="button"
              className="flex-1"
              onClick={() => {
                if (selectedType !== document.id) {
                  if (
                    selectedType === SaleDocumentType.NOTA_VENTA ||
                    document.id === SaleDocumentType.NOTA_VENTA
                  ) {
                    reset()
                    useProductStore.getState().resetProduct()
                  } else {
                    resetField("clientInfo")
                  }
                  resetClientUtil()
                  setField("documentTypeId", document.id)
                }
              }}
            >
              {document.name}
            </Button>
          ))
        ) : (
          <div className="flex flex-1 items-center justify-center">
            <SyncLoader size={14} color={Colors.bg} />
          </div>
        )}
      </section>
    </div>
  )
}
