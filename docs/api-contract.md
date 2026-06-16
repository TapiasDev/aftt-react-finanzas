# API Contract

## Objetivo

Definir el contrato HTTP esperado entre frontend y backend para autenticación y planner financiero.

## Convenciones generales

- Base URL configurable con `VITE_API_BASE_URL`.
- El frontend usa `credentials: include`.
- La autenticación se asume por cookie de sesión.
- Todas las respuestas son JSON, excepto `204 No Content`.
- Todas las fechas usan formato ISO 8601.
- Todos los montos se envían como `number`.

## Errores

Formato recomendado:

```json
{
  "message": "Human readable error message"
}
```

Codigos sugeridos:

- `400` validación o regla de negocio.
- `401` no autenticado.
- `403` autenticado pero sin permiso.
- `404` recurso no encontrado.
- `409` conflicto de estado.

## Modelos base

### AuthUser

```json
{
  "id": "user-001",
  "email": "new.user@example.com",
  "status": "New"
}
```

### AuthSession

```json
{
  "user": {
    "id": "user-001",
    "email": "new.user@example.com",
    "status": "New"
  }
}
```

### MonthSummary

```json
{
  "id": "month-2026-6",
  "year": 2026,
  "monthNumber": 6,
  "monthName": "June",
  "status": "Open",
  "closedAt": null
}
```

### FortnightPeriod

```json
{
  "id": "month-2026-6-first",
  "monthPeriodId": "month-2026-6",
  "type": "First",
  "startDate": "2026-06-01",
  "endDate": "2026-06-15",
  "incomeAmount": 1200000
}
```

### Expense

```json
{
  "id": "expense-001",
  "fortnightPeriodId": "month-2026-6-first",
  "name": "Rent",
  "description": "Apartment rent",
  "amount": 450000,
  "estimatedPaymentDate": "2026-06-05",
  "status": "Paid",
  "paidAt": "2026-06-05T08:00:00Z"
}
```

### MonthDetail

```json
{
  "id": "month-2026-6",
  "year": 2026,
  "monthNumber": 6,
  "monthName": "June",
  "status": "Open",
  "closedAt": null,
  "fortnights": [],
  "expenses": []
}
```

## Auth

### GET `/auth/me`

Uso:
- Recupera la sesión actual.

Respuestas:
- `200 OK`

```json
{
  "user": {
    "id": "user-002",
    "email": "active.user@example.com",
    "status": "Active"
  }
}
```

- `401 Unauthorized`

```json
{
  "message": "No active session."
}
```

### POST `/auth/login`

Request:

```json
{
  "email": "new.user@example.com",
  "password": "Temp12345"
}
```

Respuestas:
- `200 OK`

```json
{
  "user": {
    "id": "user-001",
    "email": "new.user@example.com",
    "status": "New"
  }
}
```

- `401 Unauthorized`

```json
{
  "message": "Invalid email or password."
}
```

### POST `/auth/change-initial-password`

Request:

```json
{
  "newPassword": "MyOwnPassword123",
  "confirmPassword": "MyOwnPassword123"
}
```

Respuestas:
- `200 OK`

```json
{
  "user": {
    "id": "user-001",
    "email": "new.user@example.com",
    "status": "Active"
  }
}
```

- `400 Bad Request`

```json
{
  "message": "Password confirmation must match the new password."
}
```

- `409 Conflict`

```json
{
  "message": "Initial password change is only available for new users."
}
```

### POST `/auth/logout`

Request:

```json
{}
```

Respuestas:
- `204 No Content`

## Planner

### GET `/planner/years`

Uso:
- Retorna solo los años disponibles del usuario autenticado.

Respuestas:
- `200 OK`

```json
[2025, 2026]
```

### GET `/planner/years/:year`

Respuestas:
- `200 OK`

```json
{
  "selectedYear": 2026,
  "months": [
    {
      "id": "month-2026-1",
      "year": 2026,
      "monthNumber": 1,
      "monthName": "January",
      "status": "Open",
      "closedAt": null
    }
  ]
}
```

- `404 Not Found`

```json
{
  "message": "Year 2026 is not available."
}
```

### GET `/planner/years/:year/months/:month`

Respuestas:
- `200 OK`

```json
{
  "id": "month-2026-6",
  "year": 2026,
  "monthNumber": 6,
  "monthName": "June",
  "status": "Open",
  "closedAt": null,
  "fortnights": [
    {
      "id": "month-2026-6-first",
      "monthPeriodId": "month-2026-6",
      "type": "First",
      "startDate": "2026-06-01",
      "endDate": "2026-06-15",
      "incomeAmount": 1200000
    },
    {
      "id": "month-2026-6-second",
      "monthPeriodId": "month-2026-6",
      "type": "Second",
      "startDate": "2026-06-16",
      "endDate": "2026-06-30",
      "incomeAmount": 1350000
    }
  ],
  "expenses": []
}
```

### PATCH `/planner/fortnights/:fortnightId/income`

Request:

```json
{
  "incomeAmount": 1500000
}
```

Respuestas:
- `200 OK`

```json
{
  "id": "month-2026-6-first",
  "monthPeriodId": "month-2026-6",
  "type": "First",
  "startDate": "2026-06-01",
  "endDate": "2026-06-15",
  "incomeAmount": 1500000
}
```

- `409 Conflict`

```json
{
  "message": "Income cannot be updated for a closed month."
}
```

### POST `/planner/expenses`

Request:

```json
{
  "fortnightPeriodId": "month-2026-6-first",
  "name": "Internet",
  "amount": 90000,
  "estimatedPaymentDate": "2026-06-12",
  "description": "Home internet bill"
}
```

Respuestas:
- `200 OK`

```json
{
  "id": "month-2026-6",
  "year": 2026,
  "monthNumber": 6,
  "monthName": "June",
  "status": "Open",
  "closedAt": null,
  "fortnights": [],
  "expenses": []
}
```

- `400 Bad Request`

```json
{
  "message": "Expense date must belong to the selected fortnight."
}
```

### PATCH `/planner/expenses/:expenseId/status`

Request:

```json
{
  "isPaid": true
}
```

Respuestas:
- `200 OK`

```json
{
  "id": "month-2026-6",
  "year": 2026,
  "monthNumber": 6,
  "monthName": "June",
  "status": "Open",
  "closedAt": null,
  "fortnights": [],
  "expenses": []
}
```

### PUT `/planner/expenses/:expenseId`

Request:

```json
{
  "name": "Internet fiber",
  "amount": 110000,
  "estimatedPaymentDate": "2026-06-12",
  "description": "Home internet upgrade"
}
```

Respuestas:
- `200 OK`

```json
{
  "id": "month-2026-6",
  "year": 2026,
  "monthNumber": 6,
  "monthName": "June",
  "status": "Open",
  "closedAt": null,
  "fortnights": [],
  "expenses": []
}
```

- `409 Conflict`

```json
{
  "message": "Expense cannot be updated for a closed month."
}
```

### PATCH `/planner/months/:monthId/close`

Request:

```json
{
  "confirmClose": true
}
```

Respuestas:
- `200 OK`

```json
{
  "id": "month-2026-6",
  "year": 2026,
  "monthNumber": 6,
  "monthName": "June",
  "status": "Closed",
  "closedAt": "2026-06-30T23:59:59Z",
  "fortnights": [],
  "expenses": []
}
```

- `400 Bad Request`

```json
{
  "message": "Closing a month requires confirmation."
}
```

## Ownership

- Todos los endpoints de planner deben resolver datos solo del usuario autenticado.
- El backend no debe aceptar `userId` desde el frontend para consultar o modificar datos del planner.
- La pertenencia del dato se resuelve desde la sesión autenticada.

## Notas para backend

- `GET /auth/me` debe devolver `401` si no hay sesión.
- El login debe devolver el estado del usuario para permitir la redirección a primer acceso.
- El cambio de contraseña inicial debe actualizar el estado a `Active`.
- Los endpoints de planner deben fallar con `401` si no hay sesión.
- Los endpoints de planner deben proteger acceso cruzado entre usuarios.
