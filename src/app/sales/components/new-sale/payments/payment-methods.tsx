import { CP001_schema, CP002_schema } from "@/app/sales/schemas/payment.schema"
import { CodeComponent } from "@/app/sales/types/payment"
import CardOption from "./card-option"
import CashOption from "./cash-option"

export type SchemasComponent = CP001_schema | CP002_schema
interface PaymentComponent {
  component: React.ComponentType<{ index: number }>
  validator: (schema: SchemasComponent) => void
}

export const PaymentComponents: Record<CodeComponent, PaymentComponent> = {
  CP001: {
    component: CashOption,
    validator: (schema) => {
      const CP001_schema = schema as CP001_schema
      if (CP001_schema.amountToCollect > CP001_schema.received) {
        throw new Error("El monto total no puede ser menor que el recibido")
      }
    },
  },
  CP003: {
    component: CardOption,
    validator: () => {},
  },
  EMPTY: {
    component: () => null,
    validator: () => {},
  },
} as const
