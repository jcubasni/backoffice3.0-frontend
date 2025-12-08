import { ColumnDef, Row } from "@tanstack/react-table"
import { ProductByGroupProduct } from "@/app/products/types/product.type"
import { Switch } from "@/components/ui/switch"
import { ComboBox } from "@/shared/components/ui/combo-box"
import { dataToCombo } from "@/shared/lib/combo-box"
import { toCapitalize } from "@/shared/lib/words"
import { StateAudit } from "@/shared/types/state.type"
import { Side } from "../types/sides.type"

export function sidesColumns(
  products: ProductByGroupProduct[],
): ColumnDef<Side>[] {
  return [
    {
      header: "Nombre",
      cell: ({ row }) => (
        <p className="mx-auto flex px-4">
          <span>{toCapitalize(row.original.name)}</span>
        </p>
      ),
    },
    ...["A", "B", "C", "D"].map((letter, index) => ({
      header: `Manguera ${letter}`,
      cell: ({ row }: { row: Row<Side> }) => {
        const productSelect = row.original.hoses?.[index]?.product?.productId
        const productState = row.original.hoses?.[index]?.stateAudit
        return (
          <div className="flex size-full items-center justify-center gap-3">
            <Switch checked={productState === StateAudit.ACTIVE} />
            <ComboBox
              className="max-w-48"
              options={dataToCombo(products, "productId", "description")}
              defaultValue={productSelect?.toString()}
              disabled={productState !== StateAudit.ACTIVE}
            />
          </div>
        )
      },
    })),
  ]
}
