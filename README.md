# Rsbuild project

## Setup

Install the dependencies:

```bash
npm install
pnpm install
bun install
```

## Get started

Start the dev server:

```bash
npm dev
pnpm dev
bun dev
```

Build the app for production:

```bash
npm build
pnpm build
bun build
```

Preview the production build locally:

```bash
npm preview
pnpm preview
bun preview
```

## Módulos del Sistema

Este es un sistema backoffice de Punto de Venta (POS) con los siguientes módulos principales:

### 1. Autenticación (`auth/`)
Sistema de autenticación y gestión de sesiones de usuario. Incluye formulario de login con validación de credenciales, manejo de sesiones mediante API y toggle de visibilidad de contraseña.

### 2. Depósitos Bancarios (`bank-deposit/`)
Gestión y seguimiento de depósitos bancarios. Permite registrar depósitos con detalles de denominaciones (billetes y monedas), filtrado por fechas, observaciones y vista previa de información. Integrado con reportes diarios.

### 3. Cuentas (`accounts/`)
Administración de cuentas de clientes y placas vehiculares. Incluye búsqueda de clientes por documento (DNI, RUC, Carnet), gestión de placas asociadas, seguimiento de disponibilidad de productos por cliente y manejo de información de cuentas de crédito.

### 4. Ventas (`sales/`)
Gestión integral de ventas, comprobantes y procesamiento de transacciones. Soporta múltiples métodos de pago (efectivo, tarjeta, cheque), pagos en cuotas, gestión de comprobantes y recibos, y seguimiento de cantidades y precios de productos.

### 5. Reporte Diario (`daily-report/`)
Reportes de liquidación diaria y conciliación de cajas. Permite crear y cerrar reportes diarios, seleccionar y gestionar cajas registradoras, seguimiento de estado de reportes y generación de documentación de liquidación.

### 6. Detalle de Cajas (`detail-boxes/`)
Gestión de detalles y conciliación de cajas registradoras. Visualización de información detallada de cajas, seguimiento de detalles de conciliación de efectivo y gestión de múltiples cajas registradoras.

### 7. Varilla (`dipstick/`)
Seguimiento de mediciones de nivel de combustible mediante lecturas de varilla. Registra niveles de tanques de combustible con lecturas iniciales y finales, actualización de mediciones durante reportes diarios.

### 8. Contómetro (`contometer/`)
Gestión de lecturas de contómetro (odómetro) de combustible. Registra lecturas de kilometraje/contómetro de vehículos con valores iniciales y finales, actualización durante conciliación diaria.

### 9. Inventario (`inventory/`)
Gestión de catálogo de productos e inventario. Mantiene catálogo de productos, gestión de disponibilidad y seguimiento de precios y unidades.

### 10. Cobranzas (`collections/`)
Gestión de cobranza de documentos y pagos:
- **Documentos**: Seguimiento de documentos pendientes, gestión de cuotas y monitoreo de estado de pagos
- **Pagos**: Registro de aplicaciones de pago, múltiples métodos de pago, gestión de referencias y notas

### 11. Créditos (`credits/`)
Gestión de créditos y líneas de crédito de clientes. Seguimiento de información de créditos y visualización de datos relacionados.

### 12. Empresas (`companies/`)
Gestión de información de empresas/sucursales. Listado y visualización de información de empresas, gestión de múltiples entidades empresariales/sucursales.

### 13. Configuraciones (`configurations/`)
Configuración del sistema y mantenimiento. Incluye:
- Configuración de bancos y cuentas bancarias
- Gestión de sucursales
- Administración de monedas
- Tipos de depósitos
- Configuración de tipos de documentos
- Gestión de grupos/series de documentos
- Configuración de series documentarias
- Gestión de lados/ubicaciones
- Administración de cuentas de usuario y permisos

### 14. Soporte (`support/`)
Herramientas administrativas de soporte y gestión de empresas. Operaciones administrativas y utilidades de soporte.

### 15. PDF (`pdf/`)
Generación de reportes en PDF y Excel:
- **Reportes PDF**: Liquidaciones diarias, reportes de ventas, ventas anuladas, faltantes/sobrantes
- **Exportación Excel**: Datos de ventas, ventas anuladas, faltantes/sobrantes
- Generación de documentos profesionales para impresión

### 16. Notas de Facturación (`billing-notes/`)
Gestión de notas de débito y crédito. Creación de notas de facturación/débito, referencia a documentos de venta originales, seguimiento de razones y ajustes, gestión de estado y aprobaciones.

### 17. Común (`common/`)
Utilidades compartidas y servicios comunes. Proporciona utilidades compartidas entre módulos, operaciones API comunes y definiciones de tipos reutilizables.

## Guía para Documentar Cambios

Al agregar tareas al archivo `todos/`, seguir estas reglas para que sean comprensibles para personas no técnicas:

### ❌ Evitar términos técnicos vagos:
- "Refactorizar componente" 
- "Optimizar hook"
- "Actualizar tipos"
- "Pequeños ajustes visuales"

### ✅ Ser específico sobre los cambios:
- "Quitar función de buscar con Enter" - Se eliminó la búsqueda automática al presionar Enter
- "Cambiar badges de sedes por diseño consistente" - Se cambió de colores aleatorios a color azul uniforme
- "Mejorar mensajes cuando no hay sedes" - Se cambió texto plano por badges más visibles
- "Usar validación automática de formularios" - Se cambió para usar esquemas que se validan solos

### Estructura recomendada:
**[Acción específica]** - [Descripción de qué cambió exactamente]

Esto ayuda a entender qué se hizo sin necesidad de conocimientos técnicos.
