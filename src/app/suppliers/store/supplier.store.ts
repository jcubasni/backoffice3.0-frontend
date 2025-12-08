import { create } from "zustand";
import type { SupplierResponse as Supplier } from "../types/supplier.type";

type SupplierStore = {
  suppliers: Supplier[];
  addSupplier: (supplier: Supplier) => void;
};

export const useSupplierStore = create<SupplierStore>((set) => ({
  suppliers: [],

  addSupplier: (supplier) =>
    set((state) => ({
      suppliers: [...state.suppliers, supplier],
    })),
}));
