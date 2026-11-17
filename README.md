# ACME · Gestión de empleados

Aplicación de consola en Node.js para que el área de Talento Humano de ACME registre, liste, busque, actualice y elimine empleados.

![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?logo=nodedotjs&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES%20Modules-F7DF1E?logo=javascript&logoColor=black)
![Tests](https://img.shields.io/badge/tests-node%3Atest-informational)
![Dependencias](https://img.shields.io/badge/dependencias-0-success)

Los datos se guardan en un arreglo en memoria (sin base de datos), así que se pierden al cerrar la aplicación. No usa frameworks ni librerías de terceros.

## Requisitos

- Node.js 18 o superior.

## Ejecución

```bash
git clone https://github.com/TOTO05-a/prueba-tecnica-acme.git
cd prueba-tecnica-acme
npm start
```

No hace falta `npm install`: solo se usan módulos nativos de Node (`readline`, `node:test`).

## Uso del menú

```
1. Registrar empleado
2. Listar empleados
3. Buscar empleado por identificación
4. Actualizar empleado
5. Eliminar empleado
0. Salir
```

- **Registrar:** pide los datos y muestra el **ID único** asignado (1, 2, 3…; nunca se reutiliza, aunque se elimine un empleado).
- **Buscar:** se hace por número de **identificación** (RF-03).
- **Actualizar / Eliminar:** se hacen por **ID único** (RF-04, RF-05). El ID aparece al registrar y en el listado.
- Al actualizar, presione Enter para conservar el valor actual de un campo. Si no cambia nada, se avisa.
- Antes de eliminar se muestra el nombre del empleado y se pide confirmación (`s`, `si` o `sí`).

### Pensado para que cualquier persona lo use

- **Cada dato se valida en cuanto se escribe.** Si un campo no cumple una regla, se explica el motivo y se vuelve a pedir **solo ese campo**, sin perder lo ya escrito:
  ```
  Nombres:
    El campo nombres es obligatorio.
  Nombres: Ana
  ```
- La identificación repetida se detecta en cuanto se escribe, no al final.
- El salario se escribe sin separador de miles (`6500` o `6500.50`). Así `1.500` no se guarda por error como 1,5.
- Si ocurre un error, se muestra el mensaje y se vuelve al menú: la aplicación no se cierra. `Ctrl+C` sale de forma ordenada.

## Requerimientos y reglas implementadas

| Código | Descripción | Dónde |
| --- | --- | --- |
| RF-01 | Registrar empleado con ID único | `EmpleadoService.registrar` |
| RF-02 | Listar empleados | `EmpleadoService.listar` |
| RF-03 | Buscar por identificación | `EmpleadoService.buscarPorIdentificacion` |
| RF-04 | Actualizar por ID único | `EmpleadoService.actualizar` |
| RF-05 | Eliminar por ID único | `EmpleadoService.eliminar` |
| RN-01 | Nombres y apellidos no vacíos | `EmpleadoValidator` |
| RN-02 | Género `M`, `F` u `O` (acepta minúsculas) | `EmpleadoValidator` |
| RN-03 | Email, teléfono, dirección y ciudad obligatorios | `EmpleadoValidator` |
| RN-04 | Profesión y cargo obligatorios | `EmpleadoValidator` |
| RN-05 | Salario numérico mayor que 0 (sin separador de miles) | `EmpleadoValidator` |

Validaciones adicionales: la identificación es obligatoria y no puede repetirse (tampoco al actualizar), y el email debe tener un formato básico válido.

## Estructura

```
src/
  index.js                         # arma las dependencias y arranca la app
  models/Empleado.js               # datos de un empleado
  repositories/EmpleadoRepository.js  # arreglo en memoria; asigna el ID
  validators/EmpleadoValidator.js  # reglas de negocio RN-01 a RN-05
  services/EmpleadoService.js      # casos de uso RF-01 a RF-05
  views/Consola.js                 # menú interactivo
tests/
  EmpleadoService.test.js
```

## POO y SOLID

- **Responsabilidad única:** cada clase hace una sola cosa: la vista conversa con el usuario, el validador aplica las reglas, el repositorio guarda los datos y el servicio coordina los casos de uso.
- **Inversión de dependencias:** el servicio recibe el repositorio y el validador por el constructor (`index.js` los crea). Se podría cambiar el arreglo por otro almacenamiento sin tocar el servicio ni la vista.
- **Encapsulamiento:** los atributos internos usan campos privados (`#`), y el repositorio entrega **copias** de los empleados. Así ningún dato se modifica sin pasar por las validaciones del servicio.

## Pruebas

```bash
npm test
```

Usa el runner nativo `node:test`. Cubre cada requerimiento funcional (RF-01 a RF-05), cada regla de negocio (RN-01 a RN-05), la validación campo por campo, que los IDs no se reutilicen y que los datos no puedan modificarse desde fuera.

## Variables de entorno

Ninguna: la aplicación no usa configuración externa.

## Autor

**Antonio Cruz** · [github.com/TOTO05-a](https://github.com/TOTO05-a)
