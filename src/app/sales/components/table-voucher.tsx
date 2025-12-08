import { Button } from "@/components/ui/button"
import { Card, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ComboBox } from "@/shared/components/ui/combo-box"
import { ComboSearch } from "@/shared/components/ui/combo-search"
import { DataTable } from "@/shared/components/ui/data-table"
import { DatePicker } from "@/shared/components/ui/date-picker"
import { Input } from "@/shared/components/ui/input"
import { useVoucher } from "../hooks/voucher/useVoucher"

export function TableVoucher() {
  const {
    platesOptions,
    selectedClient,
    isLoadingClients,
    isLoadingPlates,
    handleLocalParamChange,
    handleDateChange,
    handleClientSearch,
    handleClientSelect,
    handleSaleNotesSearch,
    productsOptions,
    table,
    clientOptions,
    handleRowSelect,
    localParams,
  } = useVoucher()

  return (
    <>
      <Card>
        <CardHeader className="flex w-full flex-wrap justify-between gap-2 px-0">
          <h2 className="font-bold text-xl">CANJE DE VALES</h2>
          <Separator />
        </CardHeader>
        <section className="grid grid-cols-3 items-end gap-4">
          <ComboSearch
            label="Cliente"
            classContainer="col-span-2 w-full!"
            placeholder="Buscar cliente..."
            options={clientOptions}
            value={selectedClient}
            isLoading={isLoadingClients}
            onSearch={handleClientSearch}
            onSelect={handleClientSelect}
          />
          <ComboBox
            label="Placa"
            className="w-full!"
            options={platesOptions}
            value={localParams.plate}
            disabled={!selectedClient}
            placeholder={
              !selectedClient
                ? "Selecciona un cliente"
                : selectedClient &&
                    platesOptions.length === 0 &&
                    !isLoadingPlates
                  ? "No hay placas disponibles"
                  : "Selecciona una placa"
            }
            isLoading={isLoadingPlates}
            onSelect={(value) => handleLocalParamChange("plate", value)}
          />
          <ComboBox
            label="Producto"
            className="w-full!"
            value={localParams.productId}
            options={productsOptions}
            disabled={!localParams.plate}
            placeholder={
              !localParams.plate
                ? "Selecciona una placa"
                : localParams.plate && productsOptions.length === 0
                  ? "No hay productos disponibles"
                  : "Selecciona un producto"
            }
            onSelect={(value) => handleLocalParamChange("productId", value)}
          />
          <DatePicker
            label="Fecha desde"
            className="w-full!"
            onSelect={(date) => handleDateChange("startDate", date)}
            value={localParams.startDate}
          />
          <DatePicker
            label="Fecha hasta"
            className="w-full!"
            onSelect={(date) => handleDateChange("endDate", date)}
            value={localParams.endDate}
          />
          <Input
            label="Monto hasta:"
            className="w-full!"
            type="number"
            min="1"
            step="0.01"
            onChange={(e) => {
              handleLocalParamChange("maximumAmount", e.target.value)
            }}
            value={localParams.maximumAmount}
          />
          <Button
            onClick={handleSaleNotesSearch}
            className="col-start-3 w-full"
          >
            Consultar
          </Button>
        </section>
      </Card>
      <Card className="flex-1">
        <DataTable table={table} className="flex-1" />
        <Button
          onClick={handleRowSelect}
          disabled={table.getSelectedRowModel().rows.length === 0}
        >
          Generar Vale
        </Button>
      </Card>
    </>
  )
}
