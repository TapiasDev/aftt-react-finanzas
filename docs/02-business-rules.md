# Business Rules

## BR-001

El sistema debe manejar años calendario reales.

## BR-002

Cada año debe tener 12 meses.

## BR-003

Cada mes debe tener dos quincenas.

## BR-004

La primera quincena inicia el día 1 y termina el día 15.

## BR-005

La segunda quincena inicia el día 16 y termina el último día real del mes.

## BR-006

Febrero debe tener 28 o 29 días según si el año es bisiesto.

## BR-007

No se pueden registrar gastos en un mes cerrado.

## BR-008

No se pueden editar gastos en un mes cerrado.

## BR-009

No se pueden eliminar gastos en un mes cerrado.

## BR-010

Un gasto debe tener nombre, valor, fecha de pago estimada y quincena.

## BR-011

El valor de un gasto debe ser mayor que cero.

## BR-012

El ingreso quincenal debe ser mayor o igual a cero.

## BR-013

Un gasto pagado debe registrar fecha de pago.

## BR-014

Un gasto pendiente no debe tener fecha de pago real.

## BR-015

El resumen financiero debe recalcularse cuando se cree, edite, elimine o pague un gasto.

## BR-016

Solo usuarios autenticados pueden acceder a la aplicación.

## BR-017

El acceso a la aplicación se realiza con `username` y contraseña.

## BR-018

Los usuarios pueden estar solo en estado `New` o `Active`.

## BR-019

Un usuario con estado `New` debe cambiar su contraseña antes de acceder al planner.

## BR-020

Un usuario con estado `Active` puede acceder al planner.

## BR-021

Los años, meses, quincenas, ingresos y gastos pertenecen a un único usuario.

## BR-022

Un usuario no puede consultar ni modificar la información financiera de otro usuario.
