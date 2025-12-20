"use client"

import type React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { AnimatePresence, motion } from "framer-motion"
import { CheckCircle2, Save } from "lucide-react"
import { useEffect, useMemo, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { useAddClient } from "@/app/accounts/hooks/useClientsService"
import { clientTabs } from "@/app/accounts/lib/client-tabs"
import { mapCreateClientSchemaToCreateClientBody } from "@/app/accounts/lib/client-create.mapper"
import {
  type CreateClientSchema,
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
import { ClientAccountsEdit } from "../client-accounts-edit"
import { ClientCardsEdit } from "../client-cards-edit"

function BlockedTabCard({
  title,
  message,
}: {
  title: string
  message: React.ReactNode
}) {
  return (
    <div className="flex-1 space-y-4 px-2">
      <h2 className="text-xl font-semibold text-foreground">{title}</h2>
      <Card className="bg-sidebar/60 p-6">
        <p className="text-sm text-muted-foreground">{message}</p>
      </Card>
    </div>
  )
}

export default function ModalAddClient() {
  const [activeTab, setActiveTab] = useState("misDatos")
  const [createdClientId, setCreatedClientId] = useState<string | null>(null)

  const addClient = useAddClient()

  const isOpen = useModalStore((state) =>
    state.openModals.some((m) => m.id === Modals.ADD_CLIENT),
  )

  // ✅ ids para evitar toasts apilados
  const blockedToastId = useRef("toast-save-client-first")
  const invalidFormToastId = useRef("client-form-invalid")
  const alreadySavedToastId = useRef("client-already-saved")
  const createErrorToastId = useRef("client-create-error")
  const createSuccessToastId = useRef("client-create-success")

  const form = useForm<CreateClientSchema>({
    resolver: zodResolver(createClientSchema),
    mode: "onChange",
  })

  // ✅ Reset limpio al abrir modal
  useEffect(() => {
    if (!isOpen) return
    setActiveTab("misDatos")
    setCreatedClientId(null)
    form.reset()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  // ✅ Tabs con gating por clientId
  const tabsForAdd = useMemo(() => {
    return clientTabs.map((tab) => {
      if (tab.id === "cuentas") {
        return {
          ...tab,
          component: createdClientId ? (
            <ClientAccountsEdit clientId={createdClientId} />
          ) : (
            <BlockedTabCard
              title="Cuentas"
              message={
                <>
                  Para crear cuentas primero debes{" "}
                  <span className="font-semibold">guardar el cliente</span>.
                </>
              }
            />
          ),
        }
      }

      if (tab.id === "tarjetas") {
        return {
          ...tab,
          component: createdClientId ? (
            <ClientCardsEdit clientId={createdClientId} />
          ) : (
            <BlockedTabCard
              title="Tarjetas del cliente"
              message={
                <>
                  Para gestionar tarjetas primero debes{" "}
                  <span className="font-semibold">guardar el cliente</span>.
                  <br />
                  Luego podrás seleccionar una cuenta y crear tarjetas.
                </>
              }
            />
          ),
        }
      }

      return tab
    })
  }, [createdClientId])

  // ✅ Submit tipado y “a prueba” de doble disparo
  const handleSubmit: (data: CreateClientSchema) => Promise<void> = async (data) => {
    if (addClient.isPending) return

    if (createdClientId) {
      toast.info("El cliente ya está guardado.", {
        id: alreadySavedToastId.current,
      })
      return
    }

    const isValid = await form.trigger()
    if (!isValid) {
      toast.error("Completa los campos obligatorios (marcados en rojo).", {
        id: invalidFormToastId.current,
      })
      return
    }

    const body = mapCreateClientSchemaToCreateClientBody(data)

    addClient.mutate(
      {
        body,
        documentTypeId: body.documentTypeId,
        documentNumber: body.documentNumber,
      },
      {
        onSuccess: ({ clientId }) => {
          setCreatedClientId(clientId)
          setActiveTab("cuentas")

          toast.success("Cliente guardado", {
            id: createSuccessToastId.current,
          })
        }
      },
    )
  }

  const handleTabChange = (tabId: string) => {
    if (tabId === activeTab) return
    if (addClient.isPending) return

    const needsClient = tabId === "cuentas" || tabId === "tarjetas"
    if (needsClient && !createdClientId) {
      toast.info("Primero guarda el cliente para continuar", {
        id: blockedToastId.current,
      })
      return
    }

    setActiveTab(tabId)
  }

  const isSaved = !!createdClientId

  return (
    <Modal
      modalId={Modals.ADD_CLIENT}
      className="h-screen! w-screen! p-1 max-lg:max-h-screen! md:max-w-5xl! lg:h-[85vh]! lg:w-fit xl:max-w-7xl!"
      scrollable
    >
      {/* ✅ forzamos el genérico para evitar el error de FormWrapper */}
      <FormWrapper<CreateClientSchema>
        form={form}
        onSubmit={handleSubmit}
        className="flex min-h-[85vh] flex-1 flex-col lg:flex-row"
      >
        <Sidebar isSaved={isSaved} />

        <main className="flex h-full flex-1 flex-col px-1 py-6 md:p-6">
          <div className="mb-4 flex items-center justify-between gap-2 px-2">
            <div className="text-sm text-muted-foreground">
              Estado:{" "}
              {isSaved ? (
                <span className="inline-flex items-center gap-1 font-semibold text-foreground">
                  <CheckCircle2 className="size-4" /> Guardado
                </span>
              ) : (
                <span className="font-semibold text-foreground">No guardado</span>
              )}
            </div>
          </div>

          <Tabs
            value={activeTab}
            onValueChange={handleTabChange}
            className="w-full flex-1 gap-4"
          >
            <TabsList className="mx-auto mb-6 h-auto w-fit justify-start gap-1.5 rounded-xl p-1 md:gap-4">
              {tabsForAdd.map((tab) => {
                const isActive = activeTab === tab.id
                const Icon = tab.icon

                return (
                  <motion.div
                    key={tab.id}
                    className="flex h-9 items-center justify-center overflow-hidden rounded-lg"
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

          {activeTab === "misDatos" && (
            <div className="mt-6 mr-3 hidden justify-end lg:flex">
              <Button
                type="submit"
                disabled={addClient.isPending || isSaved}
                variant={isSaved ? "outline" : "default"}
              >
                <Save className="mr-2 size-4" />
                {isSaved
                  ? "Cliente guardado"
                  : addClient.isPending
                    ? "Guardando..."
                    : "Guardar cliente"}
              </Button>
            </div>
          )}
        </main>

        <div className="w-full px-4 pb-4 lg:hidden">
          <Button
            type="submit"
            className="w-full"
            disabled={addClient.isPending || isSaved}
            variant={isSaved ? "outline" : "default"}
          >
            <Save className="mr-2 size-4" />
            {isSaved
              ? "Cliente guardado"
              : addClient.isPending
                ? "Guardando..."
                : "Guardar cliente"}
          </Button>
        </div>
      </FormWrapper>
    </Modal>
  )
}
