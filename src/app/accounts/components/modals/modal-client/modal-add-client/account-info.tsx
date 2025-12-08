"use client"

import { AnimatePresence, LayoutGroup, motion } from "framer-motion"
import { Plus, Trash2 } from "lucide-react"
import { JSX, useState } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import { CreateClientSchema } from "@/app/accounts/schemas/create-client.schema"
import { AccountTypeStyles } from "@/app/accounts/types/client.enum"
import { AccountTypeForClient } from "@/app/accounts/types/client.type"
import { useGetAccountTypes } from "@/app/common/hooks/useCommonService"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { TooltipButton } from "@/shared/components/ui/tooltip-button"
import { CreditAccount } from "./credit-account"

export function AccountInfo() {
  const { control, setValue } = useFormContext<CreateClientSchema>()
  const accounts = useWatch({ control, name: "accounts" }) || []

  const accountTypes = useGetAccountTypes()
  const validAccountTypeIds = Object.values(AccountTypeForClient)
  const filteredAccountTypes = accountTypes.data?.filter((type) =>
    validAccountTypeIds.includes(type.id),
  )

  const getAccountComponent = (
    accountTypeId: AccountTypeForClient,
    index: number,
  ): JSX.Element | undefined => {
    switch (accountTypeId) {
      case AccountTypeForClient.CREDIT:
        return <CreditAccount index={index} />
      default:
        return undefined
    }
  }

  const selectedAccounts = accounts.map((acc) => acc.accountTypeId)
  const [openAccordion, setOpenAccordion] = useState<string | undefined>(
    undefined,
  )

  // Generar botones disponibles filtrando los que ya están seleccionados
  const availableButtons =
    filteredAccountTypes
      ?.filter((type) => !selectedAccounts.includes(type.id))
      .map((type) => ({
        ...type,
        label: `${type.name}`,
        ...AccountTypeStyles[type.id as AccountTypeForClient],
      })) || []

  const addAccount = (button: (typeof availableButtons)[number]) => {
    const newAccount = {
      accountTypeId: button.id as AccountTypeForClient,
    }
    setValue("accounts", [...accounts, newAccount])
  }

  const deleteAccount = (accountTypeId: number) => {
    const updatedAccounts = accounts.filter(
      (acc) => acc.accountTypeId !== accountTypeId,
    )
    setValue("accounts", updatedAccounts)
  }

  return (
    <LayoutGroup>
      <div className="flex flex-col gap-4">
        <h2 className="font-semibold text-foreground text-xl">
          Gestión de Cuenta 
        </h2>
    
        {/* Sección de botones */}
        <section className="flex gap-3">
          <AnimatePresence>
            {availableButtons.map((button) => (
              <motion.button
                key={button.id}
                layoutId={`account-${button.id}`}
                type="button"
                onClick={() => addAccount(button)}
                className={cn(
                  "inline-flex h-9 items-center justify-center gap-2 rounded-sm border px-4 py-2 font-semibold text-sm text-white shadow-xs transition-colors md:text-base",
                  AccountTypeStyles[button.id as AccountTypeForClient]?.color,
                  AccountTypeStyles[button.id as AccountTypeForClient]
                    ?.hoverColor,
                )}
                exit={{ opacity: 0 }}
              >
                <Plus className="mr-2 h-4 w-4" />
                {button.label}
              </motion.button>
            ))}
          </AnimatePresence>
        </section>

        {/* Sección de cuentas seleccionadas */}
        <section className="flex flex-col gap-4">
          <AnimatePresence>
            {accounts.map((account, index) => {
              const accountTypeId = account.accountTypeId
              const accountType = filteredAccountTypes?.find(
                (type) => type.id === accountTypeId,
              )
              if (!accountType) return null

              const styles =
                AccountTypeStyles[accountTypeId as AccountTypeForClient].color
              const hasComponent = getAccountComponent(accountTypeId, index)

              return (
                <motion.div
                  key={accountTypeId}
                  layoutId={`account-${accountTypeId}`}
                  className="overflow-hidden"
                >
                  <Card className="overflow-hidden bg-sidebar/60">
                    {hasComponent ? (
                      <Accordion
                        type="single"
                        collapsible
                        value={openAccordion}
                        onValueChange={setOpenAccordion}
                      >
                        <AccordionItem
                          value={`account-${accountTypeId}`}
                          className="border-none"
                        >
                          <div className="flex items-center justify-between bg-inherit p-4">
                            <AccordionTrigger className="flex-1 py-0 hover:no-underline">
                              <div className="flex items-center gap-3">
                                <div
                                  className={cn("h-3 w-3 rounded", styles)}
                                />
                                <span className="font-semibold text-foreground capitalize">
                                  Cuenta {accountType.name}
                                </span>
                              </div>
                            </AccordionTrigger>

                            <TooltipButton
                              icon={Trash2}
                              tooltip="Eliminar cuenta"
                              onClick={() => deleteAccount(accountTypeId)}
                            />
                          </div>

                          <AccordionContent>
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.2, delay: 0.2 }}
                              className="space-y-6 border-slate-200 border-t p-6"
                            >
                              {hasComponent}
                            </motion.div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    ) : (
                      <div className="flex items-center justify-between bg-transparent p-4">
                        <div className="flex items-center gap-3">
                          <div className={cn("h-3 w-3 rounded", styles)} />
                          <span className="font-semibold text-foreground capitalize">
                            Cuenta {accountType.name}
                          </span>
                        </div>

                        <TooltipButton
                          icon={Trash2}
                          tooltip="Eliminar cuenta"
                          onClick={() => deleteAccount(accountTypeId)}
                        />
                      </div>
                    )}
                  </Card>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </section>
      </div>
    </LayoutGroup>
  )
}
