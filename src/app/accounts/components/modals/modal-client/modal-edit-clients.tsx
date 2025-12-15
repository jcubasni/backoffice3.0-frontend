"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { AnimatePresence, motion } from "framer-motion"
import { Save } from "lucide-react"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"

import { SidebarEditClient } from "./sidebar-edit-client"
import { ClientEditInfo } from "./client-edit-info"
import { ClientAccountsEdit } from "./client-accounts-edit"
import { ClientCardsEdit } from "./client-cards-edit" // 👈 NUEVO IMPORT

import { clientTabs } from "@/app/accounts/lib/client-tabs"

import {
  EditClientSchema,
  editClientSchema,
} from "@/app/accounts/schemas/edit-client.schema"
import { useEditClient } from "@/app/accounts/hooks/useClientsService"
import { Modals } from "@/app/accounts/types/modals-name"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FormWrapper } from "@/shared/components/form/form-wrapper"
import Modal from "@/shared/components/ui/modal"
import { useModalStore } from "@/shared/store/modal.store"

export default function ModalEditClients() {
  const [activeTab, setActiveTab] = useState("misDatos")

  const dataModal = useModalStore((state) =>
    state.openModals.find((modal) => modal.id === Modals.EDIT_CLIENT),
  )?.prop as any | undefined

  const { mutate, isPending } = useEditClient()

  const form = useForm<EditClientSchema>({
    resolver: zodResolver(editClientSchema),
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      address: "",
      department: "",
      province: "",
      district: "",
      email: "",
      phone: "",
    },
  })

  useEffect(() => {
    if (dataModal) {
      form.reset({
        firstName: dataModal.firstName ?? "",
        lastName: dataModal.lastName ?? "",
        address: dataModal.address ?? "",
        department: dataModal.department ?? "",
        province: dataModal.province ?? "",
        district: dataModal.district ?? "",
        email: dataModal.email ?? "",
        phone: dataModal.phoneNumber ?? dataModal.phone ?? "",
      })
    }
  }, [dataModal, form])

  if (!dataModal) {
    return null
  }

  const handleSubmit = (data: EditClientSchema) => {
    if (!dataModal?.id) {
      console.error("Client id not found in modal data")
      return
    }

    const payload = {
      firstName: data.firstName,
      lastName: data.lastName,
      address: data.address,
      email: data.email,
      phone: data.phone,
    }

    mutate({
      clientId: dataModal.id,
      data: payload,
    })
  }

  const submitForm = form.handleSubmit(handleSubmit)

  // 👉 Tabs con overrides específicos para edición
  const editableTabs = clientTabs.map((tab) => {
    if (tab.id === "misDatos") {
      return {
        ...tab,
        component: <ClientEditInfo client={dataModal} />,
      }
    }

    if (tab.id === "cuentas") {
      return {
        ...tab,
        component: <ClientAccountsEdit clientId={dataModal.id} />,
      }
    }

    // 👇 NUEVO: tab "tarjetas" usando datos reales del backend
    if (tab.id === "tarjetas") {
      return {
        ...tab,
        component: <ClientCardsEdit clientId={dataModal.id} />,
      }
    }

    return tab
  })

  return (
    <Modal
      modalId={Modals.EDIT_CLIENT}
      className="h-screen! w-screen! p-1 max-lg:max-h-screen! md:max-w-5xl! lg:h-[85vh]! lg:w-fit xl:max-w-7xl!"
      scrollable
    >
      <FormWrapper
        form={form}
        onSubmit={handleSubmit}
        className="flex min-h-[85vh] flex-1 flex-col gap-6 lg:flex-row"
      >
        {/* SIDEBAR */}
        <SidebarEditClient onSubmit={submitForm} disabled={isPending} />

        {/* CONTENIDO */}
        <main className="flex h-full flex-1 flex-col px-1 py-6 md:p-6">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="flex-1 w-full"
          >
            <TabsList className="mx-auto mb-6 h-auto w-fit gap-1.5 rounded-xl p-1 md:gap-4">
              {editableTabs.map((tab) => {
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
                      <div className="flex items-center gap-2">
                        <Icon className="size-4" />
                        <AnimatePresence>
                          {isActive && (
                            <motion.span
                              className="whitespace-nowrap font-medium"
                              initial={{ opacity: 0, width: 0 }}
                              animate={{ opacity: 1, width: "auto" }}
                              exit={{ opacity: 0, width: 0 }}
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

            {editableTabs.map((tab) => (
              <TabsContent
                key={tab.id}
                value={tab.id}
                className="flex-1 space-y-4 px-2"
              >
                {tab.component || (
                  <div className="flex h-full items-center justify-center text-slate-500">
                    Contenido no disponible
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>

          {/* BOTÓN FINAL EN MODO MOBILE */}
          <div className="w-full px-4 pb-4 lg:hidden">
            <Button type="submit" className="w-full" disabled={isPending}>
              <Save className="size-4" />
              {isPending ? "Guardando..." : "Guardar cambios"}
            </Button>
          </div>
        </main>
      </FormWrapper>
    </Modal>
  )
}
