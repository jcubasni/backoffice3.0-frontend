import { useClientHelpers } from "@/app/sales/hooks/sale/client/useClient.helper"
import { useSaleHelpers } from "@/app/sales/hooks/sale/useSale.helper"
import { useVehicleHelpers } from "@/app/sales/hooks/sale/vehicle/useVehicle.helper"
import { ComboBoxForm } from "@/shared/components/form/combo-box-form"
import { InputForm } from "@/shared/components/form/input-form"
import { ComboSearch } from "@/shared/components/ui/combo-search"
import { DocumentsList } from "./documents-list"

export const ClientInfo = () => {
  const {
    handleDeselect,
    handleSearch,
    handleSelect,
    clients,
    selectedClient,
    filterClients,
  } = useClientHelpers()

  const { isSaleNote } = useSaleHelpers()

  const {
    plates,
    accountId,
    handlePlateSelect,
    handlePlateChange,
    isLoadingVehicles,
  } = useVehicleHelpers()
  return (
    <div className="flex flex-col gap-2">
      <DocumentsList />
      <section className="grid items-end gap-2 gap-x-4 md:grid-cols-2">
        <ComboSearch
          label="Cliente"
          placeholder="Buscar cliente..."
          options={clients}
          onSearch={handleSearch}
          onSelect={handleSelect}
          onDeselect={handleDeselect}
          value={selectedClient}
          isLoading={filterClients.isLoading}
          classContainer="col-span-full"
        />
        <InputForm
          name="clientInfo.address"
          label="Dirección"
          classContainer="col-span-full"
        />
        {!isSaleNote() ? (
          <InputForm
            name="vehicleInfo.plate"
            label="Placa"
            onChange={(e) => handlePlateChange(e.target.value)}
          />
        ) : (
          <ComboBoxForm
            name="vehicleInfo.plate"
            label="Placa"
            options={plates}
            className="w-full!"
            disabled={!accountId}
            placeholder={
              accountId ? "Seleccione una placa" : "Selecciona un cliente"
            }
            onSelect={handlePlateSelect}
            isLoading={isLoadingVehicles}
          />
        )}
        <InputForm name="vehicleInfo.mileage" label="Kilómetros" />
        <InputForm name="chofer" label="Chofer" />
        <InputForm
          name="bonus"
          label="Puntos bonus"
          classContainer="col-span-full"
        />
      </section>
    </div>
  )
}