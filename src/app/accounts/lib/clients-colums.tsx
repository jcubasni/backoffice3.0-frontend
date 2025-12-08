import { useNavigate } from "@tanstack/react-router";
import { ColumnDef } from "@tanstack/react-table";
import { CarFront, ChevronDown, Edit, Fuel } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { TooltipButton } from "@/shared/components/ui/tooltip-button";
import { Routes } from "@/shared/lib/routes";
import { useModalStore } from "@/shared/store/modal.store";
import { ClientResponse } from "../types/client.type";
import { Modals } from "../types/modals-name";

export const clientsColumns: ColumnDef<ClientResponse>[] = [
  {
    id: "expander",
    size: 20,
    header: () => null,
    cell: ({ row }) => {
      const hasAccounts =
        row.original.accounts && row.original.accounts.length > 0;
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
  {
    header: "Tipo documento",
    accessorKey: "documentType.name",
  },
  {
    header: "N° documento",
    accessorKey: "documentNumber",
  },
  {
    header: "Cliente",
    cell: ({ row }) => (
      <p className="mx-auto max-w-120 truncate text-ellipsis">
        {row.original.firstName.toUpperCase()}{" "}
        {row.original.lastName?.toUpperCase()}
      </p>
    ),
  },
  {
    header: "Bloquear cuenta",
    cell: ({ row }) => {
      if (row.original.accounts.length === 0) return null;
      const state = row.original.accounts[0]?.status;
      return <Switch defaultChecked={state} />;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const navigate = useNavigate();
      const client = row.original;
      const openModal = useModalStore.getState().openModal;

      return (
        <TooltipButton.Box>
          <TooltipButton
            tooltip="Editar"
            onClick={() => openModal(Modals.EDIT_CLIENT, client)}
            icon={Edit}
          />
          {client.accounts.length > 0 && (
            <>
              {/* <TooltipButton
                tooltip="Agregar Producto"
                onClick={() =>
                  openModal(Modals.ADD_PRODUCT, client.accounts[0].accountId)
                }
                icon={Fuel}
              />
              <TooltipButton
                tooltip="Agregar Vehiculos"
                icon={CarFront}
                onClick={() =>
                  navigate({
                    to: Routes.Plates,
                    search: {
                      doc: client.documentNumber,
                      type: client.documentType.id,
                    },
                    state: {
                      accountId: client.accounts[0].accountId,
                    },
                  })
                }
              /> */}
            </>
          )}
        </TooltipButton.Box>
      );
    },
  },
];
