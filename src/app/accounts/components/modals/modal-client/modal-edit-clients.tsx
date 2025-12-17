"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { AnimatePresence, motion } from "framer-motion"
import { Save } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { useForm, useWatch } from "react-hook-form"

import { SidebarEditClient } from "./sidebar-edit-client"
import { ClientEditInfo } from "./client-edit-info"
import { ClientAccountsEdit } from "./client-accounts-edit"
import { ClientCardsEdit } from "./client-cards-edit"

import { clientTabs } from "@/app/accounts/lib/client-tabs"
import {
  EditClientSchema,
  editClientSchema,
} from "@/app/accounts/schemas/edit-client.schema"
import { useEditClient } from "@/app/accounts/hooks/useClientsService"
import { useGetDistrictById } from "@/app/accounts/hooks/useUbigeoService"
import { Modals } from "@/app/accounts/types/modals-name"
import type { ClientResponse } from "@/app/accounts/types/client.type"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FormWrapper } from "@/shared/components/form/form-wrapper"
import Modal from "@/shared/components/ui/modal"
import { useModalStore } from "@/shared/store/modal.store"

export default function ModalEditClients() {
  const [activeTab, setActiveTab] = useState("misDatos")

  const dataModal = useModalStore((state) =>
    state.openModals.find((modal) => modal.id === Modals.EDIT_CLIENT),
  )?.prop as (ClientResponse & {
    address?: string
    phone?: string
    districtId?: string
  }) | undefined

  const clientId = dataModal?.id
  const { mutate, isPending } = useEditClient()

  const form = useForm<EditClientSchema>({
    resolver: zodResolver(editClientSchema),
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      address: "",
      departmentId: "",
      provinceId: "",
      districtId: "",
      email: "",
      phone: "",
    },
  })

  // ✅ cargar data base del modal
  useEffect(() => {
    if (!dataModal) return

    form.reset({
      firstName: dataModal.firstName ?? "",
      lastName: dataModal.lastName ?? "",
      address: dataModal.address ?? "",
      departmentId: "",
      provinceId: "",
      districtId: dataModal.districtId ?? "",
      email: dataModal.email ?? "",
      phone: dataModal.phoneNumber ?? dataModal.phone ?? "",
    })
  }, [dataModal, form])

  // ✅ precargar departmentId + provinceId usando districtId
  const districtId = useWatch({ control: form.control, name: "districtId" })
  const districtByIdQuery = useGetDistrictById(districtId)

  useEffect(() => {
    if (!districtByIdQuery.data) return

    form.setValue("departmentId", districtByIdQuery.data.department.id)
    form.setValue("provinceId", districtByIdQuery.data.province.id)
    form.trigger(["departmentId", "provinceId", "districtId"])
  }, [districtByIdQuery.data, form])

  const handleSubmit = (data: EditClientSchema) => {
    if (!clientId) return

      const payload = {
  firstName: data.firstName,
  lastName: data.lastName,
  address: data.address,
  districtId: data.districtId, // ✅ ESTE ES EL CLAVE
  email: data.email,
  phone: data.phone,
}




    mutate({ clientId, data: payload })
  }

  const submitForm = form.handleSubmit(handleSubmit)

  const editableTabs = useMemo(() => {
    return clientTabs.map((tab) => {
      if (tab.id === "misDatos") {
        return {
          ...tab,
          component: <ClientEditInfo client={dataModal as any} />,
        }
      }

      if (tab.id === "cuentas") {
        return {
          ...tab,
          component: clientId ? (
            <ClientAccountsEdit clientId={clientId} />
          ) : (
            <div className="text-sm text-muted-foreground">
              No se encontró el ID del cliente.
            </div>
          ),
        }
      }

      if (tab.id === "tarjetas") {
        return {
          ...tab,
          component: clientId ? (
            <ClientCardsEdit clientId={clientId} />
          ) : (
            <div className="text-sm text-muted-foreground">
              No se encontró el ID del cliente.
            </div>
          ),
        }
      }

      return tab
    })
  }, [clientId, dataModal])

  if (!dataModal) return null

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
        <SidebarEditClient onSubmit={submitForm} disabled={isPending} />

        <main className="flex h-full flex-1 flex-col px-1 py-6 md:p-6">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full flex-1"
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
