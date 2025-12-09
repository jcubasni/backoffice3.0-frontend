import { useNavigate } from "@tanstack/react-router";
import { ColumnDef } from "@tanstack/react-table";
import { ChevronDown, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { TooltipButton } from "@/shared/components/ui/tooltip-button";
import { useModalStore } from "@/shared/store/modal.store";

import { ClientResponse } from "../types/client.type";
import { Modals } from "../types/modals-name";

export const clientsColumns: ColumnDef<ClientResponse>[] = [

  // 🔽 EXPANDER (NO OCULTABLE)
  {
    id: "expander",
    size: 20,
    header: " ",
    enableHiding: false,
    cell: ({ row }) => {
      const hasAccounts = row.original.accounts?.length > 0;

      return hasAccounts && row.getCanExpand() ? (
        <Button
          variant="ghost"
          onClick={() => row.toggleExpanded()}
          className="h-6 w-6 p-0"
        >
          <ChevronDown
            className={cn(
              "h-4 w-4 transition-transform",
              row.getIsExpanded() && "rotate-180"
            )}
          />
        </Button>
      ) : null;
    },
  },

  // 📌 1 — Tipo documento
  {
    header: "Tipo documento",
    accessorKey: "documentType.name",
  },

  // 📌 2 — Número documento
  {
    header: "N° documento",
    accessorKey: "documentNumber",
  },

  // 📌 3 — Cliente
  {
    header: "Cliente",
    accessorFn: (row) =>
      `${row.firstName ?? ""} ${row.lastName ?? ""}`.trim(),
    cell: ({ row }) => (
      <p className="mx-auto max-w-120 truncate text-ellipsis">
        {row.original.firstName?.toUpperCase()}{" "}
        {row.original.lastName?.toUpperCase()}
      </p>
    ),
  },

  {
    header: "Teléfono",
    accessorKey: "phoneNumber",
  },

  {
    header: "Correo",
    accessorKey: "email",
  },

  {
    header: "Dirección",
    accessorKey: "address",
    enableHiding: true,
  },

  {
    header: "Departamento",
    accessorKey: "department",
    enableHiding: true,
  },

  {
    header: "Provincia",
    accessorKey: "province",
    enableHiding: true,
  },

  {
    header: "Distrito",
    accessorKey: "district",
    enableHiding: true,
  },
  // 📌 Estado cuenta
  {
    header: "Bloquear cuenta",
    enableHiding: false,
    cell: ({ row }) => {
      if (!row.original.accounts?.length) return null;

      const state = row.original.accounts[0]?.status;
      return <Switch defaultChecked={state} />;
    },
  },
  // ACTIONS
  {
    id: "actions",
    header: "Acciones",
    enableHiding: false, // ❗ Nunca ocultar
    cell: ({ row }) => {
      const openModal = useModalStore.getState().openModal;
      const client = row.original;

      return (
        <TooltipButton.Box>
          <TooltipButton
            tooltip="Editar"
            onClick={() => openModal(Modals.EDIT_CLIENT, client)}
            icon={Edit}
          />
        </TooltipButton.Box>
      );
    },
  },
];
