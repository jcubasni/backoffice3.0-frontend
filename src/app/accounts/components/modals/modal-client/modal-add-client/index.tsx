"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { AnimatePresence, motion } from "framer-motion"
import { Save } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { useAddClient } from "@/app/accounts/hooks/useClientsService"
import { mapCreateClientSchemaToClientDTO } from "@/app/accounts/lib/client-mapper"
import { clientTabs } from "@/app/accounts/lib/client-tabs"
import {
  CreateClientSchema,
  createClientSchema,
} from "@/app/accounts/schemas/create-client.schema"
import { Modals } from "@/app/accounts/types/modals-name"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FormWrapper } from "@/shared/components/form/form-wrapper"
import Modal from "@/shared/components/ui/modal"
import { useModalStore } from "@/shared/store/modal.store"

import { Sidebar } from "./sidebar-client"
import { ClientCardsEdit } from "../client-cards-edit"

export default function ModalAddClient() {
  const [activeTab, setActiveTab] = useState("misDatos")

  // ✅ cuando se cree el cliente, guardamos su id aquí
  const [createdClientId, setCreatedClientId] = useState<string | null>(null)

  const addClient = useAddClient()

  // ✅ para detectar apertura/cierre del modal y resetear estado
  const isOpen = useModalStore((state) =>
    state.openModals.some((m) => m.id === Modals.ADD_CLIENT),
  )

  const form = useForm<CreateClientSchema>({
    resolver: zodResolver(createClientSchema),
    mode: "onChange",
  })

  // ✅ Reset limpio cada vez que se abre el modal
  useEffect(() => {
    if (!isOpen) return

    setActiveTab("misDatos")
    setCreatedClientId(null)
    form.reset()
  }, [isOpen, form])

  // 🔁 tabs: en "tarjetas" mostramos real si ya existe clientId
  const tabsForAdd = useMemo(() => {
    return clientTabs.map((tab) => {
      if (tab.id !== "tarjetas") return tab

      // ✅ Cliente ya creado → UI REAL
      if (createdClientId) {
        return {
          ...tab,
          component: <ClientCardsEdit clientId={createdClientId} />,
        }
      }

      // ❗ Cliente no creado → placeholder
      return {
        ...tab,
        component: (
          <div className="flex-1 space-y-4 px-2">
            <h2 className="text-xl font-semibold text-foreground">
              Tarjetas del cliente
            </h2>

            <Card className="bg-sidebar/60 p-6">
              <p className="text-sm text-muted-foreground">
                Para gestionar tarjetas primero debes{" "}
                <span className="font-semibold">guardar el cliente</span>. <br />
                Luego podrás seleccionar una cuenta y crear tarjetas.
              </p>
            </Card>
          </div>
        ),
      }
    })
  }, [createdClientId])

  const handleSubmit = (data: CreateClientSchema) => {
    const clientDTO = mapCreateClientSchemaToClientDTO(data)

    addClient.mutate(clientDTO, {
      onSuccess: (created: any) => {
        // ✅ intenta encontrar el id de forma tolerante
        const newId =
          created?.id ??
          created?.clientId ??
          created?.idClient ??
          created?.data?.id ??
          created?.data?.clientId

        if (!newId) {
          toast.error("Se creó el cliente pero no llegó el id.")
          return
        }

        toast.success("Cliente guardado. Ahora puedes gestionar tarjetas.")
        setCreatedClientId(String(newId))
        setActiveTab("tarjetas")
      },
      onError: () => {
        toast.error("No se pudo guardar el cliente")
      },
    })
  }

  const handleTabChange = (tabId: string) => {
    // ✅ no dejes entrar a Tarjetas si aún no guardó el cliente
    if (tabId === "tarjetas" && !createdClientId) {
      toast.info("Primero guarda el cliente para gestionar tarjetas")
      return
    }
    setActiveTab(tabId)
  }

  return (
    <Modal
      modalId={Modals.ADD_CLIENT}
      className="h-screen! w-screen! p-1 max-lg:max-h-screen! md:max-w-5xl! lg:h-[85vh]! lg:w-fit xl:max-w-7xl!"
      scrollable
    >
      <FormWrapper
        form={form}
        onSubmit={handleSubmit}
        className="flex min-h-[85vh] flex-1 flex-col lg:flex-row"
      >
        <Sidebar />

        <main className="flex h-full flex-1 px-1 py-6 md:p-6">
          <Tabs value={activeTab} onValueChange={handleTabChange} className="flex-1 w-full gap-4">
            <TabsList className="mx-auto mb-6 h-auto w-fit justify-start gap-1.5 rounded-xl p-1 md:gap-4">
              {tabsForAdd.map((tab) => {
                const isActive = activeTab === tab.id
                const Icon = tab.icon

                return (
                  <motion.div
                    key={tab.id}
                    className="flex h-9 items-center justify-center overflow-hidden rounded-lg"
                    onClick={() => handleTabChange(tab.id)}
                    initial={false}
                    animate={{ width: isActive ? "auto" : "36px" }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  >
                    <TabsTrigger value={tab.id} className="h-9 w-full">
                      <div className="flex items-center justify-center gap-2">
                        <Icon className="size-4 shrink-0" />
                        <AnimatePresence initial={false} mode="wait">
                          {isActive && (
                            <motion.span
                              className="overflow-hidden whitespace-nowrap font-medium"
                              initial={{ opacity: 0, width: 0 }}
                              animate={{ opacity: 1, width: "auto" }}
                              exit={{ opacity: 0, width: 0 }}
                              transition={{
                                duration: 0.2,
                                ease: "easeOut",
                                opacity: { duration: 0.15 },
                              }}
                            >
                              {tab.label}
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </div>
                    </TabsTrigger>
                  </motion.div>
                )
              })}
            </TabsList>

            {tabsForAdd.map((tab) => (
              <TabsContent
                key={tab.id}
                value={tab.id}
                className="flex-1 space-y-4 px-2"
              >
                {tab.component || (
                  <div className="flex h-full flex-col items-center justify-center gap-2 py-12">
                    <p className="text-sm text-slate-500">Contenido no disponible</p>
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </main>

        {/* Botón guardar (mobile) */}
        <div className="w-full px-4 pb-4 lg:hidden">
          <Button type="submit" className="w-full" disabled={addClient.isPending}>
            <Save className="size-4" />
            {addClient.isPending ? "Guardando..." : "Guardar cliente"}
          </Button>
        </div>
      </FormWrapper>
    </Modal>
  )
}
