# Frontend Feature Architecture

## Objetivo

Construir el frontend con una arquitectura por features conectada directamente a la API real sin reescribir la UI.

## Capas

```txt
src/
  app/
  pages/
  widgets/
  features/
  entities/
  shared/
  services/
```

## Responsabilidades

### `app`

- Providers globales.
- Bootstrap de la aplicación.
- Configuración transversal.

### `pages`

- Composición de pantallas completas.
- Orquestación de widgets de una vista.

### `widgets`

- Secciones visuales grandes reutilizables.
- Combinan varias features o entidades.

### `features`

- Casos de uso del usuario.
- Acciones y formularios concretos.
- Ejemplos: iniciar sesión, cambiar contraseña inicial, seleccionar año, editar ingreso quincenal.

### `entities`

- Modelo del dominio.
- Lógica pura de negocio asociada a entidades.
- Ejemplo: cálculo del resumen financiero.

### `shared`

- Tipos comunes.
- Utilidades puras.
- Formateadores y validaciones.
- Componentes UI atómicos si aparecen.

### `services`

- Contratos de acceso a datos.
- Implementaciones `api`.

## Regla de dependencias

- `pages` puede usar `widgets`, `features`, `entities` y `shared`.
- `widgets` puede usar `features`, `entities` y `shared`.
- `features` puede usar `entities`, `shared` y `services`.
- `entities` puede usar `shared`.
- `shared` no depende de capas superiores.
- `services` expone contratos e implementaciones, sin depender de UI.

## Estrategia de datos

- La UI consume una interfaz `AuthService` para autenticación.
- La UI consume una interfaz `PlannerService`.
- Las implementaciones actuales usan `authServiceApi` y `plannerServiceApi`.
- El servicio activo sale de `src/services/planner-service/index.ts`.
- El servicio auth activo sale de `src/services/auth-service/index.ts`.
- Los adapters `api` usan `fetch` con `Authorization: Bearer <token>`.
- La URL base sale de `VITE_API_BASE_URL`.

## Estado de aplicación

- `AuthProvider` centraliza:
- sesión actual
- usuario autenticado
- login
- cambio obligatorio de contraseña inicial
- logout

- `PlannerProvider` centraliza:
- años disponibles
- año seleccionado
- resumen de meses del año
- mes seleccionado
- quincena seleccionada
- estado de carga y error

- Los widgets y features consumen el estado por medio de `usePlanner()`.

## Estrategia de validación

- Las validaciones de dominio viven en `shared/lib/validation.ts`.
- Las features muestran errores, pero no contienen la lógica de negocio.
- Las reglas críticas también deben existir en la futura API.

## Fases de construcción

1. Autenticación y primer acceso.
2. Selección de período y calendario base.
3. Ingreso quincenal y resumen financiero.
4. Registro y edición de gastos.
5. Cambio de estado pagado/pendiente.
6. Cierre de mes y modo readonly.
7. Integración completa con la API real.

## Contrato actual mínimo

- `getCurrentSession()`
- `signIn(input)`
- `changeInitialPassword(input)`
- `signOut()`
- `getAvailableYears()`
- `getYear(year)`
- `getMonth(year, month)`
- `saveFortnightIncome(input)`

## Endpoints esperados

```txt
GET    /auth/me
POST   /auth/login
POST   /auth/change-initial-password
POST   /auth/logout

GET    /planner/years
GET    /planner/years/:year
GET    /planner/years/:year/months/:month
PATCH  /planner/fortnights/:fortnightId/income
POST   /planner/expenses
PATCH  /planner/expenses/:expenseId/status
PUT    /planner/expenses/:expenseId
PATCH  /planner/months/:monthId/close
```

## Configuracion

```txt
VITE_API_BASE_URL=http://localhost:8000
```

## Extensiones siguientes

- `createExpense(input)`
- `updateExpense(input)`
- `toggleExpenseStatus(input)`
- `closeMonth(input)`

## Criterio práctico

- Cada feature debe ser construible y testeable por separado.
- La página solo compone piezas; la lógica queda fuera de ella.
- Los cálculos financieros deben ser funciones puras.
