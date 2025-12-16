"use client"

import { AnimatePresence, LayoutGroup, motion } from "framer-motion"
import { Plus, Trash2 } from "lucide-react"
import type { JSX } from "react"
import { useMemo, useState } from "react"
import { useFormContext, useWatch } from "react-hook-form"

import type { CreateClientSchema } from "@/app/accounts/schemas/create-client.schema"
import { AccountTypeStyles } from "@/app/accounts/types/client.enum"
import { AccountTypeForClient } from "@/app/accounts/types/client.type"
import { useGetAccountTypes } from "@/app/accounts/hooks/useClientsService"

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

  const { data: accountTypes } = useGetAccountTypes()

  const validAccountTypeIds = useMemo(
    () => [AccountTypeForClient.CREDIT, AccountTypeForClient.ANTICIPO, AccountTypeForClient.CANJE],
    [],
  )

  const filteredAccountTypes = useMemo(() => {
    return accountTypes?.filter((type) => validAccountTypeIds.includes(type.id)) ?? []
  }, [accountTypes, validAccountTypeIds])

  const selectedAccounts = useMemo(
    () => accounts.map((acc) => acc.accountTypeId),
    [accounts],
  )

  const [openAccordion, setOpenAccordion] = useState<string | undefined>(undefined)

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

  // Botones disponibles (no seleccionados aún)
  const availableButtons = useMemo(() => {
    return filteredAccountTypes
      .filter((type) => !selectedAccounts.includes(type.id))
      .map((type) => ({
        id: type.id as AccountTypeForClient,
        name: type.name,
        label: type.name,
        styles: AccountTypeStyles[type.id as AccountTypeForClient],
      }))
  }, [filteredAccountTypes, selectedAccounts])

  const addAccount = (accountTypeId: AccountTypeForClient) => {
    // evita duplicados (por si acaso)
    if (selectedAccounts.includes(accountTypeId)) return

    const newAccount = { accountTypeId }
    setValue("accounts", [...accounts, newAccount], { shouldDirty: true })
  }

  const deleteAccount = (accountTypeId: number) => {
    const updatedAccounts = accounts.filter((acc) => acc.accountTypeId !== accountTypeId)
    setValue("accounts", updatedAccounts, { shouldDirty: true })
  }

  return (
    <LayoutGroup>
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-foreground">Gestión de Cuenta</h2>

        {/* Botones */}
        <section className="flex flex-wrap gap-3">
          <AnimatePresence>
            {availableButtons.map((button) => (
              <motion.button
                key={button.id}
                layoutId={`account-${button.id}`}
                type="button"
                onClick={() => addAccount(button.id)}
                className={cn(
                  "inline-flex h-9 items-center justify-center gap-2 rounded-sm border px-4 py-2 text-sm font-semibold text-white shadow-xs transition-colors md:text-base",
                  button.styles?.color,
                  button.styles?.hoverColor,
                )}
                exit={{ opacity: 0 }}
              >
                <Plus className="h-4 w-4" />
                {button.label}
              </motion.button>
            ))}
          </AnimatePresence>
        </section>

        {/* Cuentas seleccionadas */}
        <section className="flex flex-col gap-4">
          <AnimatePresence>
            {accounts.map((account, index) => {
              const accountTypeId = account.accountTypeId as AccountTypeForClient
              const accountType = filteredAccountTypes.find((type) => type.id === accountTypeId)
              if (!accountType) return null

              const styles = AccountTypeStyles[accountTypeId]?.color
              const component = getAccountComponent(accountTypeId, index)
              const key = `account-${accountTypeId}`

              return (
                <motion.div key={key} layoutId={key} className="overflow-hidden">
                  <Card className="overflow-hidden bg-sidebar/60">
                    {component ? (
                      <Accordion
                        type="single"
                        collapsible
                        value={openAccordion}
                        onValueChange={setOpenAccordion}
                      >
                        <AccordionItem value={key} className="border-none">
                          <div className="flex items-center justify-between bg-inherit p-4">
                            <AccordionTrigger className="flex-1 py-0 hover:no-underline">
                              <div className="flex items-center gap-3">
                                <div className={cn("h-3 w-3 rounded", styles)} />
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
                              className="space-y-6 border-t border-slate-200 p-6"
                            >
                              {component}
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
