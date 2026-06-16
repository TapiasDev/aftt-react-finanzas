# README.md

# Expense Planner

Sistema para registrar ingresos y gastos por año, mes y quincena con acceso privado por usuario.

## Objetivo

Permitir que un usuario final pueda:

- Iniciar sesión con `username` y contraseña.
- Cambiar su contraseña en el primer acceso si su estado es `New`, con cambio opcional de `username`.
- Seleccionar un año.
- Seleccionar un mes.
- Registrar gastos por primera o segunda quincena.
- Ingresar el ingreso quincenal.
- Marcar gastos como pagados.
- Visualizar cuánto debe pagar, cuánto ha pagado, cuánto le falta y cuánto le queda.
- Cerrar un mes para bloquear cambios.
- Visualizar la información en formato calendario real.

## Reglas de usuarios

- Los usuarios se crean manualmente en la base de datos.
- Cada usuario ingresa con `username`.
- Los estados disponibles son `New` y `Active`.
- Si el usuario está en estado `New`, el sistema exige cambio de contraseña antes de entrar al planner.
- Los datos financieros son privados por usuario.

## Usuarios de ejemplo

- Usuario nuevo: `new.user` / `Temp12345`
- Usuario activo: `active.user` / `Active12345`

## Configuración de servicios

Variables disponibles:

```txt
VITE_API_BASE_URL=http://localhost:8000
```

- `VITE_API_BASE_URL` define la URL base del backend.

## Estructura SDD

```txt
docs/
specs/
architecture/
tasks/
```

## Flujo principal

1. Usuario ingresa con `username` y contraseña.
2. Si el estado es `New`, el sistema obliga el cambio de contraseña.
3. Usuario entra al planner con estado `Active`.
4. Usuario selecciona año.
5. Usuario selecciona mes.
6. Usuario selecciona quincena.
7. Usuario registra ingreso quincenal.
8. Usuario registra gastos.
9. Sistema calcula resumen financiero.
10. Usuario marca gastos como pagados.
11. Usuario cierra el mes cuando finaliza.
