// src/app/promotions/components/promotions/promotions.tsx

import { useState } from "react";
import { usePromotions, useDeletePromotion } from "../../hooks/usePromotions";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Loader2, Package, Gift, Eye } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Promotion } from "../../lib/list-promotions.type";

export default function Promotions() {
  const [startDate, setStartDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [selectedPromotion, setSelectedPromotion] = useState<Promotion | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const { data, isLoading, error } = usePromotions({ startDate });
  const deletePromotion = useDeletePromotion();

  const handleDelete = (promotionId: string, description: string) => {
    if (
      window.confirm(
        `¿Está seguro que desea eliminar la promoción "${description}"?`
      )
    ) {
      deletePromotion.mutate(promotionId);
    }
  };

  const handleViewDetail = (promotion: Promotion) => {
    setSelectedPromotion(promotion);
    setIsDetailOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        Error al cargar las promociones
      </div>
    );
  }

  const promotions: Promotion[] = Array.isArray(data) 
    ? data 
    : (data?.data || []);



  const getStatusBadge = (status: number) => {
    return status === 1 ? (
      <Badge variant="green">Activa</Badge>
    ) : (
      <Badge variant="secondary">Inactiva</Badge>
    );
  };

  const getPromotionTypeLabel = (type: number) => {
    const types: Record<number, string> = {
      0: "Regalo",
      1: "Descuento",
      2: "Combo",
    };
    return types[type] || "Otro";
  };

  return (
    <div className="container mx-auto py-6">
      <div className="mb-4 flex items-center gap-4">
        <div className="flex items-center gap-2">
          <label htmlFor="startDate" className="text-sm font-medium">
            Fecha de inicio:
          </label>
          <Input
            id="startDate"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-auto"
          />
        </div>
      </div>

      {promotions.length === 0 ? (
        <div className="text-center text-muted-foreground p-8">
          No hay promociones disponibles para la fecha seleccionada
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Descripción</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Local</TableHead>
              <TableHead>Productos</TableHead>
              <TableHead>Bonificaciones</TableHead>
              <TableHead>Fecha Inicio</TableHead>
              <TableHead>Fecha Fin</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {promotions.map((promotion: Promotion) => (
              <TableRow key={promotion.promotionId}>
                <TableCell>
                  <div>
                    <div className="text-xs text-start font-semibold">{promotion.description}</div>
                    {promotion.note && (
                      <div className="text-xs max-w-md line-clamp-2 text-start">
                        {promotion.note}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {getPromotionTypeLabel(promotion.promotionType)}
                  </Badge>
                </TableCell>
                <TableCell>{promotion.localName || "-"}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Package className="h-4 w-4" />
                    <span>{promotion.itemCount}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Gift className="h-4 w-4" />
                    <span>{promotion.bonusCount}</span>
                  </div>
                </TableCell>
                <TableCell>
                  {format(new Date(promotion.startDate), "dd/MM/yyyy", {
                    locale: es,
                  })}
                </TableCell>
                <TableCell>
                  {format(new Date(promotion.endDate), "dd/MM/yyyy", {
                    locale: es,
                  })}
                </TableCell>
                <TableCell>{getStatusBadge(promotion.status)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      title="Ver detalle"
                      onClick={() => handleViewDetail(promotion)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    {/*
                    <Button variant="ghost" size="icon" title="Editar">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    */} 
                    <Button
                    disabled={deletePromotion.isPending}
                      variant="ghost"
                      size="icon"
                      title="Eliminar"
                      onClick={() =>
                        handleDelete(
                          promotion.promotionId,
                          promotion.description
                        )
                      }
                    >
                      
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Modal de detalle */}
      {isDetailOpen && selectedPromotion && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setIsDetailOpen(false)}
        >
          <div 
            className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold">{selectedPromotion.description}</h2>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setIsDetailOpen(false)}
              >
                ✕
              </Button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Información general */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Tipo de promoción</p>
                  <p className="font-medium">{getPromotionTypeLabel(selectedPromotion.promotionType)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Estado</p>
                  <div className="mt-1">{getStatusBadge(selectedPromotion.status)}</div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Fecha inicio</p>
                  <p className="font-medium">
                    {format(new Date(selectedPromotion.startDate), "dd/MM/yyyy HH:mm", { locale: es })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Fecha fin</p>
                  <p className="font-medium">
                    {format(new Date(selectedPromotion.endDate), "dd/MM/yyyy HH:mm", { locale: es })}
                  </p>
                </div>
              </div>

              {/* Nota */}
              {selectedPromotion.note && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Descripción</p>
                  <p className="text-sm bg-gray-50 p-3 rounded-md">{selectedPromotion.note}</p>
                </div>
              )}

              {/* Productos */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Productos ({selectedPromotion.items.length})
                </h3>
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Producto</TableHead>
                        <TableHead>Cantidad</TableHead>
                        <TableHead>Precio</TableHead>
                        <TableHead>Estado</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedPromotion.items.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.product.description}</TableCell>
                          <TableCell>{item.quantity || "-"}</TableCell>
                          <TableCell>S/ {item.price.toFixed(2)}</TableCell>
                          <TableCell>
                            {item.status === 1 ? (
                              <Badge variant="green" className="text-xs">Activo</Badge>
                            ) : (
                              <Badge variant="secondary" className="text-xs">Inactivo</Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* Bonificaciones */}
              {selectedPromotion.bonuses.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Gift className="h-5 w-5" />
                    Bonificaciones ({selectedPromotion.bonuses.length})
                  </h3>
                  <div className="border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Producto</TableHead>
                          <TableHead>Cantidad</TableHead>
                          <TableHead>Precio</TableHead>
                          <TableHead>Estado</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedPromotion.bonuses.map((bonus) => (
                          <TableRow key={bonus.id}>
                            <TableCell className="font-medium">{bonus.product.description}</TableCell>
                            <TableCell>{bonus.quantity || "-"}</TableCell>
                            <TableCell>S/ {bonus.price.toFixed(2)}</TableCell>
                            <TableCell>
                              {bonus.status === 1 ? (
                                <Badge variant="green" className="text-xs">Activo</Badge>
                              ) : (
                                <Badge variant="secondary" className="text-xs">Inactivo</Badge>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}

              {/* Resumen */}
              <div>
                <h3 className="font-semibold mb-3">Resumen</h3>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="bg-gray-50 p-3 rounded-md">
                    <p className="text-muted-foreground">Total productos</p>
                    <p className="text-xl font-semibold mt-1">{selectedPromotion.itemCount}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <p className="text-muted-foreground">Total bonificaciones</p>
                    <p className="text-xl font-semibold mt-1">{selectedPromotion.bonusCount}</p>
                  </div>
                  <div className="bg-green-200 p-3 rounded-md">
                    <p className="text-muted-foreground">Monto</p>
                    <p className="text-xl font-semibold mt-1">S/. {selectedPromotion.discountPercent}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}