import { Building, Calendar, CreditCard, Hash, User } from "lucide-react";
import type { SaleResponse } from "@/app/sales/types/sale/sale.type";
import { Separator } from "@/components/ui/separator";
import Modal from "@/shared/components/ui/modal";
import { formatDate } from "@/shared/lib/date";
import { formatCurrency } from "@/shared/lib/number";
import { useModalStore } from "@/shared/store/modal.store";

export default function ModalPreviewSale() {
  const data = useModalStore((state) => state.openModals).find(
    (modal) => modal.id === "modal-preview-sale"
  )?.prop as SaleResponse | undefined;

  if (!data) {
    return null;
  }

  return (
    <Modal
      modalId="modal-preview-sale"
      title={data.documentType.name}
      className="sm:max-w-md"
      scrollable={true}
    >
      <div className="space-y-4">
        {/* Document Number */}
        <div className="text-center">
          <div className="mb-1 flex items-center justify-center gap-1 text-muted-foreground text-xs">
            <Hash className="h-3 w-3" />
            Número de Documento
          </div>
          <div className="font-bold font-mono text-lg">
            {data.documentNumber}
          </div>
        </div>

        <Separator />

        {/* Client Information */}
        <div className="space-y-2">
          <div className="flex items-center gap-1 font-semibold text-muted-foreground text-xs">
            <User className="h-3 w-3" />
            CLIENTE
          </div>
          <div className="space-y-1 pl-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Nombre:</span>
              <span className="font-medium">
                {data.client.firstName} {data.client.lastName}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Documento:</span>
              <span className="font-medium">{data.client.documentNumber}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tipo:</span>
              <span className="font-medium">
                {data.client.documentType.name}
              </span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Transaction Details */}
        <div className="space-y-2">
          <div className="flex items-center gap-1 font-semibold text-muted-foreground text-xs">
            <Calendar className="h-3 w-3" />
            DETALLES DE LA TRANSACCIÓN
          </div>
          <div className="space-y-1 pl-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Fecha de emisión:</span>
              <span className="font-medium">
                {formatDate(data.issueDate, "d 'de' MMMM 'del' yyyy")}
              </span>
            </div>
            {data.documentOperationType?.name && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  Tipo de operación:
                </span>
                <span className="font-medium">
                  {data.documentOperationType.name}
                </span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Forma de pago:</span>
              <span className="font-medium">{data.saleOperationType.name}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Vendedor:</span>
              <span className="font-medium">{data.user.name}</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Cash Register */}
        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-1 text-muted-foreground">
            <Building className="h-3 w-3" />
            Caja registradora:
          </span>
          <span className="font-medium font-mono">
            {data.cashRegister.cashRegisterCode}
          </span>
        </div>

        <Separator />

        {/* Total Amount */}
        <div className="mt-4 rounded-lg bg-accent p-4">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 font-semibold text-lg">
              <CreditCard className="h-5 w-5" />
              TOTAL:
            </span>
            <span className="font-bold text-2xl">
              {formatCurrency(data.totalAmount)}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 border-t pt-4 text-center text-muted-foreground text-xs">
          Generado el {formatDate(data.createdAt, "d 'de' MMMM 'del' yyyy")}
        </div>
      </div>
    </Modal>
  );
}
