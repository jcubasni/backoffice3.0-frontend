// promotions/components/new-promotion/sections/locals.tsx
import { useFormContext } from "react-hook-form";
import { useState, useEffect, useRef } from "react";
import { Branch } from "../../../lib/promotion.types";

export default function Locals() {
    const { setValue, watch, formState: { errors } } = useFormContext();
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [branches, setBranches] = useState<Branch[]>([]);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const selectedLocals = watch("locals") || [];

    useEffect(() => {
        try {
            const localStore = localStorage.getItem("local");
            if (localStore) {
                const { state } = JSON.parse(localStore);
                setBranches(state?.branch || []);
            }
        } catch (error) {
            console.error("Error al obtener branches del localStorage:", error);
        }
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleLocal = (localId: string) => {
        const currentLocals = selectedLocals;
        const newLocals = currentLocals.includes(localId)
            ? currentLocals.filter((id: string) => id !== localId)
            : [...currentLocals, localId];

        setValue("locals", newLocals, { shouldValidate: true });
    };

    const removeLocal = (localId: string) => {
        const newLocals = selectedLocals.filter((id: string) => id !== localId);
        setValue("locals", newLocals, { shouldValidate: true });
    };

    const selectAll = () => {
        const allLocalIds = branches.map(b => b.localId);
        setValue("locals", allLocalIds, { shouldValidate: true });
    };

    const clearAll = () => {
        setValue("locals", [], { shouldValidate: true });
    };

    const getSelectedBranches = () => {
        return branches.filter(b => selectedLocals.includes(b.localId));
    };

    const filteredBranches = branches.filter(branch =>
        branch.localName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        branch.localCode.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">
                Locales <span className="text-red-500">*</span>
            </label>

            <div className="relative" ref={dropdownRef}>
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className={`w-full flex items-center justify-between px-3 py-2 border rounded-md bg-white hover:bg-gray-50 transition-colors ${errors.locals ? 'border-red-500' : 'border-gray-300'
                        }`}
                >
                    <span className={selectedLocals.length === 0 ? 'text-gray-500' : 'text-gray-900'}>
                        {selectedLocals.length === 0
                            ? "Seleccionar locales..."
                            : `${selectedLocals.length} local(es) seleccionado(s)`}
                    </span>
                    <svg
                        className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>

                {isOpen && (
                    <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-80 overflow-hidden">
                        <div className="p-2 border-b border-gray-200">
                            <input
                                type="text"
                                placeholder="Buscar local..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                onClick={(e) => e.stopPropagation()}
                            />
                        </div>

                        <div className="flex gap-2 p-2 border-b border-gray-200 bg-gray-50">
                            <button
                                type="button"
                                onClick={selectAll}
                                className="flex-1 px-3 py-1.5 text-sm bg-white border border-gray-300 rounded hover:bg-gray-100 transition-colors"
                            >
                                Seleccionar todos
                            </button>
                            <button
                                type="button"
                                onClick={clearAll}
                                className="flex-1 px-3 py-1.5 text-sm bg-white border border-gray-300 rounded hover:bg-gray-100 transition-colors"
                            >
                                Limpiar
                            </button>
                        </div>

                        <div className="max-h-60 overflow-y-auto">
                            {filteredBranches.length === 0 ? (
                                <div className="px-4 py-3 text-sm text-gray-500 text-center">
                                    No se encontró el local.
                                </div>
                            ) : (
                                filteredBranches.map((branch) => (
                                    <div
                                        key={branch.localId}
                                        onClick={() => toggleLocal(branch.localId)}
                                        className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer transition-colors"
                                    >
                                        <div className="flex items-center justify-center w-4 h-4 mr-3 border border-gray-400 rounded">
                                            {selectedLocals.includes(branch.localId) && (
                                                <svg className="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                            )}
                                        </div>
                                        <span className="font-mono text-xs mr-2 text-gray-600">{branch.localCode}</span>
                                        <span className="text-sm">{branch.localName}</span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </div>

            {errors.locals && (
                <span className="text-sm text-red-500">
                    {errors.locals.message as string}
                </span>
            )}

            {/* Mostrar locales seleccionados */}
            {selectedLocals.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                    {getSelectedBranches().map((branch) => (
                        <div
                            key={branch.localId}
                            className="flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1.5 rounded-md text-sm"
                        >
                            <span className="font-mono text-xs font-semibold">{branch.localCode}</span>
                            <span>{branch.localName}</span>
                            <button
                                type="button"
                                onClick={() => removeLocal(branch.localId)}
                                className="ml-1 hover:bg-blue-200 rounded-full p-0.5 transition-colors"
                            >
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}