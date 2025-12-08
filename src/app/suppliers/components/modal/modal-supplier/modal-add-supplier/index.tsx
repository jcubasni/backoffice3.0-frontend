"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { AnimatePresence, motion } from "framer-motion"
import { Save } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"

import { CreateSupplierSchema, createSupplierSchema } from "@/app/suppliers/schemas/create-supplier.schema"
import { supplierTabs } from "@/app/suppliers/lib/supplier-tabs"

import { SidebarSupplier } from "./sidebar-supplier"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FormWrapper } from "@/shared/components/form/form-wrapper"
import Modal from "@/shared/components/ui/modal"
import { Modals } from "@/app/suppliers/types/modals-name"
import { useAddSupplier } from "@/app/suppliers/hooks/useSuppliersService"

export default function ModalAddSupplier() {
  const [activeTab, setActiveTab] = useState("misDatos")

  const addSupplier = useAddSupplier()

  const form = useForm<CreateSupplierSchema>({
    resolver: zodResolver(createSupplierSchema),
    mode: "onChange",
  })

  const handleSubmit = (data: CreateSupplierSchema) => {
    console.log("Proveedor Registrado:", data)
    addSupplier.mutate(data)
  }

  return (
    <Modal
      modalId={Modals.ADD_SUPPLIER}
      className="h-screen! w-screen! p-1 max-lg:max-h-screen! md:max-w-4xl! lg:h-[85vh]! lg:w-fit"
      scrollable
    >
      <FormWrapper
        form={form}
        onSubmit={handleSubmit}
        className="flex min-h-[85vh] flex-1 flex-col lg:flex-row"
      >
        <SidebarSupplier />

        <main className="flex flex-1 px-1 py-6 md:p-6 h-full">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full flex-1 gap-4"
          >
            <TabsList className="mx-auto mb-6 h-auto w-fit justify-start gap-1.5 rounded-xl p-1 md:gap-4">
              {supplierTabs.map((tab) => {
                const Icon = tab.icon
                const isActive = activeTab === tab.id

                return (
                  <motion.div
                    key={tab.id}
                    className="flex h-9 items-center justify-center overflow-hidden rounded-lg"
                    onClick={() => setActiveTab(tab.id)}
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

            {supplierTabs.map((tab) => (
              <TabsContent
                key={tab.id}
                value={tab.id}
                className="flex-1 space-y-4 px-2"
              >
                {tab.component}
              </TabsContent>
            ))}
          </Tabs>
        </main>

        <div className="w-full px-4 pb-4 lg:hidden">
          <Button type="submit" className="w-full">
            <Save className="size-4" />
            Guardar
          </Button>
        </div>
      </FormWrapper>
    </Modal>
  )
}
