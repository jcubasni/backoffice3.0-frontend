"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { AnimatePresence, motion } from "framer-motion"
import { Save } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { useAddClient } from "@/app/accounts/hooks/useClientsService"
import { mapCreateClientSchemaToClientDTO } from "@/app/accounts/lib/client-mapper"
import { clientTabs } from "@/app/accounts/lib/client-tabs"
import {
  CreateClientSchema,
  createClientSchema,
} from "@/app/accounts/schemas/create-client.schema"
import { Modals } from "@/app/accounts/types/modals-name"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FormWrapper } from "@/shared/components/form/form-wrapper"
import Modal from "@/shared/components/ui/modal"
import { Sidebar } from "./sidebar-client"

export default function ModalAddClient() {
  const [activeTab, setActiveTab] = useState("misDatos")
  const addClient = useAddClient()
  const form = useForm<CreateClientSchema>({
    resolver: zodResolver(createClientSchema),
    mode: "onChange",
  })

  const handleSubmit = (data: CreateClientSchema) => {
    const clientDTO = mapCreateClientSchemaToClientDTO(data)
    addClient.mutate(clientDTO)
    console.log("Form data:", data)
    console.log("DTO to send:", clientDTO)
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

        {/* Main Content Area */}
        <main className="flex flex-1 px-1 py-6 md:p-6 h-full">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full flex-1 gap-4"
          >
            <TabsList className="mx-auto mb-6 h-auto w-fit justify-start gap-1.5 rounded-xl p-1 md:gap-4">
              {clientTabs.map((tab) => {
                const isActive = activeTab === tab.id
                const Icon = tab.icon

                return (
                  <motion.div
                    key={tab.id}
                    className="flex h-9 items-center justify-center overflow-hidden rounded-lg"
                    onClick={() => setActiveTab(tab.id)}
                    initial={false}
                    animate={{
                      width: isActive ? "auto" : "36px",
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 25,
                    }}
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
            {clientTabs.map((tab) => (
              <TabsContent
                key={tab.id}
                value={tab.id}
                className="flex-1 space-y-4 px-2"
              >
                {tab.component || (
                  <div className="flex h-full flex-col items-center justify-center gap-2 py-12">
                    <p className="text-slate-500 text-sm">
                      Contenido no disponible
                    </p>
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </main>

        {/* Floating Save Button - Only visible on small screens */}
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
