import { useEffect, useMemo } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import { useGetPlates } from "@/app/accounts/hooks/usePlatesServicec"
import { SaleSchema } from "@/app/sales/schemas/sale.schema"
import { useClientUtilStore } from "@/app/sales/store/client-util.store"
import { PaymentType } from "@/app/sales/types/sale"

export const useVehicleHelpers = () => {
  const { control, setValue, resetField } = useFormContext<SaleSchema>()
  const setField = useClientUtilStore((state) => state.setField)
  const paymentType = useClientUtilStore((state) => state.paymentType)

  const [accountId, plate] = useWatch({
    control: control,
    name: ["accountCardId", "vehicleInfo.plate"],
  })

  const vehicles = useGetPlates(accountId)

  const plates = useMemo(
    () =>
      vehicles.data
        ?.filter((plate) => plate.vehicle !== null)
        .map((plate) => ({
          label: plate.vehicle?.plate,
          value: plate.vehicle?.plate,
        })),
    [vehicles.data],
  )

  const handlePlateSelect = (plateValue: string) => {
    setValue("vehicleInfo.plate", plateValue)
  }

  const handlePlateChange = (value: string) => {
    let formattedValue = value.toUpperCase().replace(/[^A-Z0-9]/g, "")

    if (formattedValue.length > 3) {
      formattedValue = `${formattedValue.slice(0, 3)}-${formattedValue.slice(3, 6)}`
    }
    setValue("vehicleInfo.plate", formattedValue)
  }

  const resetAccountData = () => {
    setValue("cardId", undefined)
    setField("accountBalance", undefined)
  }

  useEffect(() => {
    if (plate?.length !== 7) return
    const selectedPlate = vehicles.data?.find(
      (p) => p.vehicle !== null && p.vehicle?.plate === plate,
    )
    if (selectedPlate) {
      setValue("cardId", selectedPlate.accountCardId)
      return setField("accountBalance", selectedPlate.balance)
    }
    resetAccountData()
  }, [plate])
  useEffect(() => {
    resetField("vehicleInfo.plate")
    if (paymentType === PaymentType.CASH) return resetAccountData()
  }, [paymentType])

  return {
    plates,
    handlePlateSelect,
    accountId,
    isLoadingVehicles: vehicles.isLoading,
    handlePlateChange,
  }
}
