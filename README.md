# Prueba Técnica Simulada — Node.js Backend Junior (Entrevista Laboral)

## De que trata el proyecto

En este proyecto desarrollo una aplicacion de consola para administrar los empleados de ACME. Puedo registrar empleados, consultar el listado, buscar por identificacion, actualizar sus datos y eliminarlos.

La informacion se guarda en un arreglo mientras la aplicacion esta abierta. No utilizo una base de datos todo es consola y cuando se cierra desaparecen los datos.

## Tecnologias que utilice
- Node.js: ejecuta el codigo JavaScript fuera del navegador.
- ECMAScript moderno: utilizo modulos, clases, `async/await`
- `node:readline/promises`: permite leer las opciones y los datos que ingreso desde la terminal.
- `node:crypto`: genera el identificador unico de cada empleado.
- `node:test` y `node:assert`: permiten ejecutar pruebas sin instalar paquetes externos.

## Como ejecutar
Primero entro a la carpeta del proyecto:

```
cd prueba-tecnica_acme-antonio-cruz
```

Sin dependencias externas


```
node src/index.js
```

## Como utilizar el menu
Al iniciar aparece el menu principal:

1. Registrar empleado
2. Listar empleados
3. Buscar empleado por identificacion
4. Actualizar empleado
5. Eliminar empleado
0. Salir

Para registrar un empleado ingreso todos sus datos. El sistema valida los campos y muestra el identificador unico generado.

Para actualizar o eliminar necesito el identificador unico que aparece al registrar el empleado, la busqueda se realiza por numero de identificacion. En el examen es el requisito RF-03.

Los datos permanecen en memoria durante la ejecucion. Si cierro la aplicacion y vuelvo a iniciarla, el arreglo comienza vacio.

## Validaciones que implemente
- Los nombres y apellidos no pueden quedar vacios.
- El genero acepta unicamente M, F u O.
- Identificacion, email, telefono, direccion y ciudad son obligatorios.
- Profesion y cargo son obligatorios.
- El email debe tener un formato basico valido.
- El salario debe ser un numero superior a cero.
- No permito registrar dos empleados con la misma identificacion.
- Al actualizar, tampoco permito utilizar la identificacion de otro empleado.

## Estructura del proyecto
```
src/
  controllers/
    EmpleadoController.js
  models/
    Empleado.js
  repositories/
    EmpleadoRepository.js
  services/
    EmpleadoService.js
  views/
    Consola.js
  index.js
tests/
  EmpleadoService.test.js
package.json
.gitignore
README.md
```

- `src/models`: contiene la clase que representa a un empleado.
- `src/repositories`: administra el arreglo y las operaciones basicas sobre los datos.
- `src/services`: contiene las reglas de negocio y las validaciones.
- `src/controllers`: conecta las acciones de la consola con los servicios.
- `src/views`: muestra el menu, solicita datos y presenta resultados.
- `src/index.js`: crea las dependencias y arranca la aplicacion.
- `tests`: contiene las pruebas automatizadas.

## Como funciona la arquitectura por capas

Cuando inicio el programa, `index.js` crea el repositorio, el servicio, el controlador y la consola.

La vista de consola recibe la opcion del usuario y llama al controlador. El controlador delega la operacion al servicio. El servicio valida los datos y utiliza el repositorio para consultar o modificar el arreglo.

Mantengo las responsabilidades separadas para que las reglas de negocio no dependan directamente de la forma en que se muestran los datos.

## Programacion orientada a objetos y SOLID

Utilizo clases para separar las responsabilidades principales:

- `Empleado` representa los datos de una persona empleada.
- `EmpleadoRepository` administra el almacenamiento en memoria.
- `EmpleadoService` aplica las reglas de negocio.
- `EmpleadoController` recibe las operaciones solicitadas por la vista.
- `Consola` se encarga de la interaccion con la terminal.

Aplico principalmente responsabilidad unica: cada clase tiene una tarea concreta. Tambien mantengo las dependencias dirigidas hacia abstracciones de responsabilidad, evitando que la vista implemente las reglas de negocio.

## Identificador y almacenamiento

Cada empleado recibe un UUID generado con `randomUUID()` de Node.js. Este valor permite identificar de forma unica el registro para actualizarlo o eliminarlo.
## Pruebas
Ejecuto las pruebas con:

```
npm test
```
Las pruebas verifican el registro, la generacion del identificador, la duplicidad de identificaciones, las validaciones, la busqueda, la actualizacion y la eliminacion.
