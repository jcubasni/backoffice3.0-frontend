"use client"

import { Upload } from "lucide-react"
import { useId } from "react"
import { supplierInfoFields } from "@/app/suppliers/lib/supplier-info-fields"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

export function SidebarSupplier() {
  const photoInputId = useId()

  return (
    <aside className="hidden w-full flex-col rounded-l-md border-border border-b bg-sidebar/60 p-4 md:p-6 lg:flex lg:w-64 lg:border-r lg:border-b-0">
      <div className="space-y-6">
        {/* Profile Photo */}
        <div className="space-y-4">
          <h3 className="font-semibold text-sidebar-foreground text-sm">
            Logo proveedor
          </h3>

          <div className="flex aspect-square items-center justify-center overflow-hidden rounded-lg border-2 border-border bg-card">
            <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
          </div>

          <Label htmlFor={photoInputId}>
            <input id={photoInputId} type="file" accept="image/*" className="hidden" />
            <Button
              type="button"
              variant="outline"
              className="w-full bg-transparent text-xs"
              onClick={() => document.getElementById(photoInputId)?.click()}
            >
              Cambiar logo
            </Button>
          </Label>
        </div>

        {/* Info */}
        <div className="space-y-3 border-t pt-4 border-border">
          <h3 className="font-semibold text-sidebar-foreground text-sm">Información</h3>
          <div className="space-y-3 text-xs">
            {supplierInfoFields.map((field) => {
              const Icon = field.icon
              return (
                <div
                  key={field.id}
                  className="flex items-start gap-3 rounded-md bg-background/60 p-2"
                >
                  <Icon className={`mt-0.5 h-4 w-4 ${field.iconColor}`} />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-foreground">{field.label}</p>
                    <p className="truncate text-muted-foreground text-xs">{field.getValue}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="mt-auto">
        <Button className="w-full">Guardar Cambios</Button>
      </div>
    </aside>
  )
}
