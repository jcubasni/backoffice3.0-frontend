"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { AnimatePresence, motion } from "framer-motion"
import { Save } from "lucide-react"
import { useEffect, useMemo, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

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

type ClientForModal = ClientResponse & {
  address?: string
  phone?: string
  districtId?: string
}

export default function ModalEditClients() {
  const [activeTab, setActiveTab] = useState("misDatos")

  const dataModal = useModalStore((state) =>
    state.openModals.find((modal) => modal.id === Modals.EDIT_CLIENT),
  )?.prop as ClientForModal | undefined

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

  const hydratedRef = useRef(false)

  const initialDistrictId = dataModal?.districtId ?? ""
  const districtByIdQuery = useGetDistrictById(initialDistrictId)

  // ✅ Snapshot inicial para detectar cambios sin isDirty
  const initialRef = useRef<Partial<EditClientSchema> | null>(null)

  // ✅ Campos que pertenecen a "Mis Datos"
  const FIELDS_MIS_DATOS: (keyof EditClientSchema)[] = [
    "firstName",
    "lastName",
    "address",
    "departmentId",
    "provinceId",
    "districtId",
    "email",
    "phone",
  ]

  // ✅ 1) Reset base al abrir el modal
  useEffect(() => {
    if (!dataModal) return

    hydratedRef.current = false

    const baseValues: EditClientSchema = {
      firstName: dataModal.firstName ?? "",
      lastName: dataModal.lastName ?? "",
      address: dataModal.address ?? "",
      departmentId: "",
      provinceId: "",
      districtId: dataModal.districtId ?? "",
      email: dataModal.email ?? "",
      phone: dataModal.phoneNumber ?? dataModal.phone ?? "",
    }

    form.reset(baseValues, { keepDirty: false, keepTouched: false })
    setActiveTab("misDatos")

    // snapshot inicial (ojo: dept/prov se completará luego)
    initialRef.current = { ...baseValues }
  }, [dataModal, form])

  // ✅ 2) Precargar dep/prov SOLO 1 VEZ
  useEffect(() => {
    if (!dataModal) return
    if (hydratedRef.current) return
    if (!districtByIdQuery.data) return

    hydratedRef.current = true

    const depId = districtByIdQuery.data.department.id
    const provId = districtByIdQuery.data.province.id

    form.setValue("departmentId", depId, {
      shouldDirty: false,
      shouldTouch: false,
      shouldValidate: false,
    })

    form.setValue("provinceId", provId, {
      shouldDirty: false,
      shouldTouch: false,
      shouldValidate: false,
    })

    // ✅ importantísimo: también actualizamos el snapshot con dep/prov reales
    if (initialRef.current) {
      initialRef.current.departmentId = depId
      initialRef.current.provinceId = provId
    }
  }, [dataModal, districtByIdQuery.data, form])

  // ✅ Detectar cambios comparando snapshot vs valores actuales
  const hasMisDatosChanges = () => {
    const initial = initialRef.current
    if (!initial) return false

    const current = form.getValues()

    return FIELDS_MIS_DATOS.some((k) => {
      const a = (initial as any)[k] ?? ""
      const b = (current as any)[k] ?? ""
      return String(a) !== String(b)
    })
  }

  // ✅ Guardar SOLO mis datos (independiente del submit del form)
  const handleSaveMisDatos = async () => {
    if (!clientId) return

    const ok = await form.trigger(FIELDS_MIS_DATOS as any, {
      shouldFocus: true,
    })

    if (!ok) {
      toast.error("Completa los campos obligatorios antes de guardar.")
      return
    }

    const v = form.getValues()

    const payload = {
      firstName: v.firstName,
      lastName: v.lastName,
      address: v.address,
      districtId: v.districtId,
      email: v.email,
      phone: v.phone,
    }

    mutate(
      { clientId, data: payload },
      {
        onSuccess: () => {
          toast.success("Mis datos actualizados correctamente")

          // ✅ actualizamos snapshot con lo actual, para que el botón se bloquee otra vez
          initialRef.current = {
            ...initialRef.current,
            ...v,
          }
        },
        onError: (err: any) => {
          toast.error(err?.message ?? "No se pudo actualizar el cliente")
        },
      },
    )
  }

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

  // ✅ botón habilitado SOLO si hay cambios y no está pending
  const canSaveMisDatos = hasMisDatosChanges() && !isPending

  return (
    <Modal
      modalId={Modals.EDIT_CLIENT}
      className="h-screen! w-screen! p-1 max-lg:max-h-screen! md:max-w-5xl! lg:h-[85vh]! lg:w-fit xl:max-w-7xl!"
      scrollable
    >
      <FormWrapper
        form={form}
        onSubmit={() => {}}
        className="flex min-h-[85vh] flex-1 flex-col gap-6 lg:flex-row"
      >
        <SidebarEditClient onSubmit={handleSaveMisDatos} disabled={isPending} />


        <main className="flex h-full flex-1 flex-col px-1 py-6 md:p-6">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full flex-1"
          >
            <TabsList className="mx-auto mb-6 h-auto w-fit gap-1.5 rounded-xl bg-muted/40 p-1 md:gap-3">
              {editableTabs.map((tab) => {
                const isActive = activeTab === tab.id
                const Icon = tab.icon

                return (
                  <motion.div
                    key={tab.id}
                    className="flex h-9 items-center justify-center overflow-hidden rounded-lg"
                    initial={false}
                    animate={{ width: isActive ? "auto" : 40 }}
                    transition={{ type: "spring", stiffness: 420, damping: 28 }}
                  >
                    <TabsTrigger
                      value={tab.id}
                      className="
                        h-9 w-full rounded-lg px-3
                        data-[state=active]:bg-background
                        data-[state=active]:shadow-sm
                        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
                      "
                    >
                      <div className="flex items-center justify-center gap-2">
                        <Icon className="size-4 shrink-0" />

                        <AnimatePresence initial={false} mode="wait">
                          {isActive ? (
                            <motion.span
                              key="label"
                              className="overflow-hidden whitespace-nowrap text-sm font-medium"
                              initial={{ opacity: 0, width: 0 }}
                              animate={{ opacity: 1, width: "auto" }}
                              exit={{ opacity: 0, width: 0 }}
                              transition={{ duration: 0.18, ease: "easeOut" }}
                            >
                              {tab.label}
                            </motion.span>
                          ) : null}
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
                  <div className="flex h-full items-center justify-center text-muted-foreground">
                    Contenido no disponible
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>

          {/* ✅ Botón SOLO en Mis Datos (independiente) */}
          {activeTab === "misDatos" && (
            <>
              {/* Desktop */}
              <div className="hidden w-full justify-end px-2 pt-4 lg:flex">
                <Button
  type="button"
  onClick={handleSaveMisDatos}
  disabled={isPending}
>
  <Save className="mr-2 size-4" />
  {isPending ? "Guardando..." : "Guardar Mis Datos"}
</Button>

              </div>

              {/* Mobile */}
              <div className="w-full px-4 pb-4 lg:hidden">
                <Button
                  type="button"
                  className="w-full"
                  onClick={handleSaveMisDatos}
                  disabled={!canSaveMisDatos}
                >
                  <Save className="mr-2 size-4" />
                  {isPending ? "Guardando..." : "Guardar Mis Datos"}
                </Button>
              </div>
            </>
          )}
        </main>
      </FormWrapper>
    </Modal>
  )
}
