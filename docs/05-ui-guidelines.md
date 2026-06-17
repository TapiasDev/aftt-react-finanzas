# UI Guidelines

## Acceso

La aplicación debe incluir:

- Pantalla de login por `username` y contraseña.
- Pantalla de cambio obligatorio de contraseña para usuarios `New`.
- Campo opcional para cambiar `username` durante el primer acceso.
- Mensaje claro cuando el usuario no puede entrar al planner sin completar el cambio.

## Vista principal

La vista principal debe contener:

- Indicador del usuario autenticado.
- Opción para cerrar sesión.
- Selector de año.
- Selector de mes.
- Calendario mensual.
- Separador de primera y segunda quincena.
- Resumen financiero.
- Lista de gastos.
- Botón para agregar gasto.
- Toggle para cambiar entre modo dark y light.

## Calendario

El calendario debe:

- Mostrar días reales del mes.
- Mostrar gastos en su fecha correspondiente.
- Diferenciar gastos pagados y pendientes.
- Ofrecer una versión tipo agenda en mobile.

## Resumen financiero

Debe mostrar:

```txt
Ingreso quincenal
Total a pagar
Total pagado
Total restante a pagar
Total que queda si pago todo
Disponible actual
```
