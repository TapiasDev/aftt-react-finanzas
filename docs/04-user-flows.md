# User Flows

## Flow 001 - Iniciar sesión

1. Usuario ingresa `email` y contraseña.
2. Sistema valida las credenciales.
3. Sistema identifica el estado del usuario.
4. Si el usuario está `Active`, entra al planner.
5. Si el usuario está `New`, se redirige al cambio obligatorio de contraseña.

## Flow 002 - Primer cambio de contraseña

1. Usuario inicia sesión con contraseña temporal.
2. Sistema detecta estado `New`.
3. Usuario registra nueva contraseña y confirmación.
4. Sistema valida la nueva contraseña.
5. Sistema actualiza el estado a `Active`.
6. Usuario entra al planner.

## Flow 003 - Registrar gastos

1. Usuario autenticado selecciona año.
2. Usuario selecciona mes.
3. Usuario selecciona quincena.
4. Usuario ingresa ingreso quincenal.
5. Usuario registra gastos.
6. Sistema actualiza resumen financiero.

## Flow 004 - Pagar gasto

1. Usuario autenticado abre mes.
2. Usuario selecciona quincena.
3. Usuario marca gasto como pagado.
4. Sistema actualiza total pagado.
5. Sistema actualiza total pendiente.

## Flow 005 - Cerrar mes

1. Usuario autenticado abre mes.
2. Usuario revisa gastos.
3. Usuario selecciona cerrar mes.
4. Sistema pide confirmación.
5. Usuario confirma.
6. Sistema bloquea el mes.
