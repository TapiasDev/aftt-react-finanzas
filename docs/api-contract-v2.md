# API Contract V2

## Objetivo

Complementar `docs/api-contract.md` con una guía más operativa para backend: tablas sugeridas, DTOs y checklist técnico.

## Supuestos

- Autenticación por cookie de sesión.
- Un usuario solo puede ver y modificar su propia información.
- Los usuarios se crean manualmente en la base de datos.
- El primer login puede ocurrir con contraseña temporal.
- Si el usuario está en `New`, debe cambiar la contraseña antes de usar el planner.

## Tablas sugeridas

### `users`

```txt
id uuid pk
email varchar unique not null
password_hash varchar not null
status varchar not null check in (New, Active)
created_at timestamptz not null
updated_at timestamptz not null
```

Notas:
- `email` en minúsculas.
- `password_hash` debe almacenar la contraseña temporal o final ya hasheada.

### `year_periods`

```txt
id uuid pk
user_id uuid not null fk users(id)
year integer not null
created_at timestamptz not null
updated_at timestamptz not null
unique(user_id, year)
```

### `month_periods`

```txt
id uuid pk
year_period_id uuid not null fk year_periods(id)
month_number integer not null
month_name varchar not null
status varchar not null check in (Open, Closed)
closed_at timestamptz null
created_at timestamptz not null
updated_at timestamptz not null
unique(year_period_id, month_number)
```

### `fortnight_periods`

```txt
id uuid pk
month_period_id uuid not null fk month_periods(id)
type varchar not null check in (First, Second)
start_date date not null
end_date date not null
income_amount numeric(14,2) not null default 0
created_at timestamptz not null
updated_at timestamptz not null
unique(month_period_id, type)
```

### `expenses`

```txt
id uuid pk
fortnight_period_id uuid not null fk fortnight_periods(id)
name varchar not null
description text not null default ''
amount numeric(14,2) not null
estimated_payment_date date not null
status varchar not null check in (Pending, Paid)
paid_at timestamptz null
created_at timestamptz not null
updated_at timestamptz not null
```

## Relación de ownership

El ownership real del gasto no necesita `user_id` directo si se puede resolver así:

```txt
expense
  -> fortnight_period
  -> month_period
  -> year_period
  -> user
```

Regla:
- toda consulta o mutación debe filtrar por el usuario autenticado antes de devolver o modificar datos.

## DTOs sugeridos

## Auth DTOs

### `POST /auth/login`

Request DTO:

```ts
interface LoginRequestDto {
  email: string
  password: string
}
```

Response DTO:

```ts
interface AuthUserDto {
  id: string
  email: string
  status: 'New' | 'Active'
}

interface AuthSessionDto {
  user: AuthUserDto
}
```

### `POST /auth/change-initial-password`

Request DTO:

```ts
interface ChangeInitialPasswordRequestDto {
  newPassword: string
  confirmPassword: string
}
```

Response DTO:

```ts
interface ChangeInitialPasswordResponseDto {
  user: AuthUserDto
}
```

### `GET /auth/me`

Response DTO:

```ts
type GetCurrentSessionResponseDto = AuthSessionDto
```

## Planner DTOs

### Shared

```ts
interface MonthSummaryDto {
  id: string
  year: number
  monthNumber: number
  monthName: string
  status: 'Open' | 'Closed'
  closedAt: string | null
}

interface FortnightPeriodDto {
  id: string
  monthPeriodId: string
  type: 'First' | 'Second'
  startDate: string
  endDate: string
  incomeAmount: number
}

interface ExpenseDto {
  id: string
  fortnightPeriodId: string
  name: string
  description: string
  amount: number
  estimatedPaymentDate: string
  status: 'Pending' | 'Paid'
  paidAt: string | null
}

interface MonthDetailDto extends MonthSummaryDto {
  fortnights: FortnightPeriodDto[]
  expenses: ExpenseDto[]
}

interface YearDataDto {
  selectedYear: number
  months: MonthSummaryDto[]
}
```

### `GET /planner/years`

Response DTO:

```ts
type GetAvailableYearsResponseDto = number[]
```

### `GET /planner/years/:year`

Response DTO:

```ts
type GetYearResponseDto = YearDataDto
```

### `GET /planner/years/:year/months/:month`

Response DTO:

```ts
type GetMonthResponseDto = MonthDetailDto
```

### `PATCH /planner/fortnights/:fortnightId/income`

Request DTO:

```ts
interface SaveFortnightIncomeRequestDto {
  incomeAmount: number
}
```

Response DTO:

```ts
type SaveFortnightIncomeResponseDto = FortnightPeriodDto
```

### `POST /planner/expenses`

Request DTO:

```ts
interface CreateExpenseRequestDto {
  fortnightPeriodId: string
  name: string
  amount: number
  estimatedPaymentDate: string
  description: string
}
```

Response DTO:

```ts
type CreateExpenseResponseDto = MonthDetailDto
```

### `PATCH /planner/expenses/:expenseId/status`

Request DTO:

```ts
interface ToggleExpenseStatusRequestDto {
  isPaid: boolean
}
```

Response DTO:

```ts
type ToggleExpenseStatusResponseDto = MonthDetailDto
```

### `PUT /planner/expenses/:expenseId`

Request DTO:

```ts
interface UpdateExpenseRequestDto {
  name: string
  amount: number
  estimatedPaymentDate: string
  description: string
}
```

Response DTO:

```ts
type UpdateExpenseResponseDto = MonthDetailDto
```

### `PATCH /planner/months/:monthId/close`

Request DTO:

```ts
interface CloseMonthRequestDto {
  confirmClose: boolean
}
```

Response DTO:

```ts
type CloseMonthResponseDto = MonthDetailDto
```

## Validaciones backend mínimas

## Auth

- `email` requerido.
- `password` requerida.
- `newPassword` requerida.
- `newPassword.length >= 8`.
- `confirmPassword` debe coincidir.
- `change-initial-password` solo si el usuario autenticado está en `New`.

## Planner

- `year` válido.
- `month` entre 1 y 12.
- `incomeAmount >= 0`.
- `expense.name` requerido.
- `expense.amount > 0`.
- `estimatedPaymentDate` dentro del mes.
- `estimatedPaymentDate` dentro de la quincena.
- no modificar meses cerrados.

## Servicios backend sugeridos

### Auth

```txt
AuthService
  - signIn(email, password)
  - getCurrentSession(session)
  - changeInitialPassword(userId, newPassword, confirmPassword)
  - signOut(session)
```

### Planner

```txt
PlannerService
  - getAvailableYears(userId)
  - getYear(userId, year)
  - getMonth(userId, year, month)
  - saveFortnightIncome(userId, fortnightId, incomeAmount)
  - createExpense(userId, input)
  - updateExpense(userId, expenseId, input)
  - toggleExpenseStatus(userId, expenseId, isPaid)
  - closeMonth(userId, monthId, confirmClose)
```

## Queries/guards de ownership recomendados

- Buscar `year_periods` por `user_id`.
- Buscar `month_periods` solo a través de `year_periods` del usuario.
- Buscar `fortnight_periods` solo a través de `month_periods` del usuario.
- Buscar `expenses` solo a través de `fortnight_periods` del usuario.

Ejemplo conceptual:

```sql
select e.*
from expenses e
join fortnight_periods f on f.id = e.fortnight_period_id
join month_periods m on m.id = f.month_period_id
join year_periods y on y.id = m.year_period_id
where e.id = :expenseId
  and y.user_id = :currentUserId;
```

## Checklist backend

### Base

- Crear tabla `users`.
- Crear tablas `year_periods`, `month_periods`, `fortnight_periods`, `expenses`.
- Definir índices y `unique` necesarios.

### Auth

- Implementar login por `email`.
- Implementar sesión por cookie.
- Implementar `GET /auth/me`.
- Implementar cambio obligatorio de contraseña.
- Cambiar `status` de `New` a `Active` al completar el flujo.

### Planner

- Crear servicio que siempre reciba `currentUserId` desde la sesión.
- Filtrar todos los accesos por ownership.
- Proteger mutaciones de meses cerrados.
- Recalcular correctamente el estado pagado y `paidAt`.

### Seguridad

- Guardar contraseñas con hash fuerte.
- Nunca devolver `password_hash`.
- Nunca aceptar `userId` desde frontend para operar planner.
- Devolver `401` si no hay sesión.

### QA mínimo

- Login válido de usuario `Active`.
- Login válido de usuario `New`.
- Cambio inicial exitoso.
- Bloqueo de acceso al planner para `New`.
- Aislamiento de datos entre dos usuarios.
- Rechazo de edición en mes cerrado.

## Decisiones pendientes para backend

- Tecnología de sesión: cookie firmada, JWT en cookie, o framework session.
- Política final de password: mínimo, complejidad, rotación.
- Estrategia de seed inicial para usuarios creados manualmente.
- Si el backend creará automáticamente los 12 meses y 2 quincenas o si lo hará bajo demanda.
