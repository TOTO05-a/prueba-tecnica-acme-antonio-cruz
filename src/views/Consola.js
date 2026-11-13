import { createInterface } from "node:readline/promises"; //importa de node una interfaz para leer y escribir en la consola por preguntas y respuestas
import { stdin, stdout } from "node:process";//modulo nativo de node que permite la entrada(stdin) y salida(stdout) de datos en la consola

export class Consola {
    constructor(empleadoController) {
        this.empleadoController = empleadoController;
        this.entrada = createInterface({ input: stdin, output: stdout });
    }

    async iniciar() {
        let salir = false;
        console.log("\nBienvenido al sistema de gestión de empleados ACME");

        while (!salir) {
            this.mostrarMenu();
            const opcion = (await this.preguntar("Seleccione una opción: ")).trim();

            try {
                switch (opcion) {
                    case "1":
                        await this.registrar();
                        break;
                      case "2":
                        this.listar();
                        break;
                      case "3":
                        this.buscar();
                        break;
                      case "4":
                        await this.actualizar();
                        break;
                      case "5":
                        this.eliminar();
                        break;
                      case "0":
                        salir = true;
                        console.log("Hasta luego.");
                        break;
                      default:
                        console.log("Opcion no valida. Intenta nuevamente.");
                    } 
            } catch (error) {
                console.log(`No se pudo completar la operacion: ${error.message}`);
              }
              if (!salir) await this.preguntar("\nPresiona Enter para continuar...");
        }
        this.entrada.close();
    }

    mostrarMenu() {console.log(`
        1. Registrar empleado
        2. Listar empleados
        3. Buscar empleado por identificacion
        4. Actualizar empleado
        5. Eliminar empleado
        0. Salir
        `);
          }

          async registrar() {
            console.log("\nRegistrar nuevo empleado");
            const datos = await this.leerDatos();
            const empleado = await this.empleadoController.registrar(datos);
            console.log(`Empleado registrado con ID: ${empleado.id}`);
            }

            listar() {
                const empleados = this.empleadoController.listar();
                if (!empleados.length) {
                    console.log("No hay empleados registrados.");
                    return;
                }

                console.table(empleados.map((empleado) => ({
                    id: empleado.id,
                    identificacion: empleado.identificacion,
                    nombres: empleado.nombres,
                    apellidos: empleado.apellidos,
                    cargo: empleado.cargo,
                    salario: empleado.salario,
                })));
            }

            async buscar() {
                const identificacion = await this.preguntar("Identificacion: ");
                const empleado = this.empleadoController.buscar(identificacion.trim());
                console.table([empleado]);
              }

              async actualizar() {
                const id = await this.preguntar("ID unico del empleado: ");
                const empleado = this.empleadoController.obtenerPorId
                  ? this.empleadoController.obtenerPorId(id.trim())
                  : null;
            
                if (!empleado) throw new Error("No se encontro el empleado indicado.");
            
                console.log("Presiona Enter para conservar el valor actual.");
                const datos = {};

                for (const campo of [
                    "identificacion", "nombres", "apellidos", "genero", "email", "telefono", "direccion", "ciudad", "profesion", "cargo", "salario" ]) {
                        const valor = await this.preguntar(`${campo} (${empleado[campo]}): `);
                        datos[campo] = valor.trim() || empleado[campo];
                    }

                    datos.salario = Number(datos.salario);
                    const actualizado = this.empleadoController.actualizar(id.trim(), datos);
                    console.log(`Empleado actualizado: ${actualizado.nombres} ${actualizado.apellidos}`);
                }

                async eliminar() {
                    const id = await this.preguntar("ID unico del empleado: ");
                    const confirmacion = await this.preguntar("¿Estas seguro de eliminar este empleado? (s/n): ");
                    if (confirmacion.trim().toLowerCase() !== "s") {
                        console.log("Eliminacion cancelada.");
                        return;
                    }

                    const empleado = this.empleadoController.eliminar(id.trim());
                    console.log(`Empleado eliminado: ${empleado.nombres} ${empleado.apellidos}`);
                }

                async leerDatos() {
                    const datos = {};
                    for (const campo of [
                        "identificacion", "nombres", "apellidos", "genero", "email", "telefono", "direccion", "ciudad", "profesion", "cargo", "salario" ]) {
                            datos[campo] = await this.preguntar(`${campo}: `);
                        }

                    datos.salario = Number(datos.salario);
                    return datos;
                }

                preguntar(mensaje) {
                    return this.entrada.question(mensaje);
                }
            }