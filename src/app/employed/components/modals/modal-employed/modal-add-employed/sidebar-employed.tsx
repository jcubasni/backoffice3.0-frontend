"use client"

import { Upload } from "lucide-react"
import { useId } from "react"
import { employedInfoFields } from "@/app/employed/lib/employed-info-fields"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

export function SidebarEmployed() {
  const photoInputId = useId()

  return (
    <aside className="hidden w-full flex-col rounded-l-md border-border border-b bg-sidebar/60 p-4 md:p-6 lg:flex lg:w-64 lg:border-r lg:border-b-0">
      <div className="space-y-6">
        
        {/* Profile Photo Section */}
        <div className="space-y-4">
          <h3 className="font-semibold text-sidebar-foreground text-sm">
            Foto
          </h3>

          <div className="flex aspect-square items-center justify-center overflow-hidden rounded-lg border-2 border-border bg-card">
            <div className="text-center">
              <Upload className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
              <p className="text-muted-foreground text-xs">Sube una foto</p>
            </div>
          </div>

          <Label htmlFor={photoInputId} className="block">
            <input
              id={photoInputId}
              type="file"
              accept="image/*"
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              className="w-full bg-transparent text-xs"
              onClick={() => document.getElementById(photoInputId)?.click()}
            >
              <Upload className="mr-2 h-3 w-3" />
              Cambiar foto
            </Button>
          </Label>
        </div>

        {/* Información */}
        <div className="space-y-3 border-border border-t pt-4">
          <h3 className="font-semibold text-sidebar-foreground text-sm">
            Información
          </h3>

          <div className="space-y-3 text-xs">
            {employedInfoFields.map((field) => {
              const Icon = field.icon

              return (
                <div
                  key={field.id}
                  className="flex items-start gap-3 rounded-md bg-background/60 p-2"
                >
                  <Icon
                    className={`mt-0.5 h-4 w-4 flex-shrink-0 ${field.iconColor}`}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-foreground">{field.label}</p>
                    <p className="truncate text-muted-foreground text-xs">
                      {field.getValue}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="mt-auto">
        <Button className="w-full">Guardar Cambios</Button>
      </div>
    </aside>
  )
}
