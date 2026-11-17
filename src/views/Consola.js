import { createInterface } from "node:readline";
import { stdin, stdout } from "node:process";

// Se lanza cuando el usuario cierra la entrada (Ctrl+C o Ctrl+D).
class EntradaCerrada extends Error {}

// Orden y etiqueta de los datos que se piden por consola.
const CAMPOS = [
  ["identificacion", "Identificación"],
  ["nombres", "Nombres"],
  ["apellidos", "Apellidos"],
  ["genero", "Género (M/F/O)"],
  ["email", "Email"],
  ["telefono", "Teléfono"],
  ["direccion", "Dirección"],
  ["ciudad", "Ciudad de residencia"],
  ["profesion", "Profesión"],
  ["cargo", "Cargo"],
  ["salario", "Salario"],
];

// Vista: solo pide datos y muestra resultados; las reglas viven en el servicio.
export class Consola {
  #servicio;
  #entrada = createInterface({ input: stdin, output: stdout });
  #lineas = this.#entrada[Symbol.asyncIterator](); // encola lo que escribe el usuario

  #opciones = [
    { texto: "Registrar empleado", accion: () => this.registrar() },
    { texto: "Listar empleados", accion: () => this.listar() },
    { texto: "Buscar empleado por identificación", accion: () => this.buscar() },
    { texto: "Actualizar empleado", accion: () => this.actualizar() },
    { texto: "Eliminar empleado", accion: () => this.eliminar() },
  ];

  constructor(servicio) {
    this.#servicio = servicio;
  }

  async iniciar() {
    console.log("\n=== ACME · Gestión de empleados ===");

    while (true) {
      try {
        this.#mostrarMenu();
        const opcion = await this.#preguntar("Seleccione una opción: ");
        if (opcion === "0") break;

        const seleccionada = this.#opciones[Number(opcion) - 1];
        if (seleccionada) await seleccionada.accion();
        else console.log("Opción no válida, intente de nuevo.");
      } catch (error) {
        if (error instanceof EntradaCerrada) break;
        console.log(`Error: ${error.message}`); // se informa y la aplicación sigue
      }
    }

    this.#entrada.close();
    console.log("\nHasta luego.");
  }

  async registrar() {
    console.log("\n-- Registrar empleado --");
    const datos = {};
    for (const [campo, etiqueta] of CAMPOS) {
      datos[campo] = await this.#preguntar(`${etiqueta}: `);
    }

    const empleado = this.#servicio.registrar(datos);
    console.log(`Empleado registrado. ID único: ${empleado.id}`);
  }

  listar() {
    const empleados = this.#servicio.listar();
    if (!empleados.length) {
      console.log("No hay empleados registrados.");
      return;
    }

    console.table(
      empleados.map(({ id, identificacion, nombres, apellidos, cargo, salario }) => ({
        id,
        identificacion,
        nombre: `${nombres} ${apellidos}`,
        cargo,
        salario,
      })),
    );
  }

  async buscar() {
    const identificacion = await this.#preguntar("Identificación: ");
    console.table(this.#servicio.buscarPorIdentificacion(identificacion));
  }

  async actualizar() {
    const id = await this.#preguntar("ID único del empleado: ");
    const empleado = this.#servicio.obtenerPorId(id);

    console.log("Presione Enter para conservar el valor actual.");
    const cambios = {};
    for (const [campo, etiqueta] of CAMPOS) {
      const valor = await this.#preguntar(`${etiqueta} [${empleado[campo]}]: `);
      if (valor) cambios[campo] = valor;
    }

    const actualizado = this.#servicio.actualizar(id, cambios);
    console.log(`Empleado actualizado: ${actualizado.nombres} ${actualizado.apellidos}`);
  }

  async eliminar() {
    const id = await this.#preguntar("ID único del empleado: ");
    const empleado = this.#servicio.obtenerPorId(id);

    const respuesta = await this.#preguntar(
      `¿Eliminar a ${empleado.nombres} ${empleado.apellidos}? (s/n): `,
    );
    if (respuesta.toLowerCase() !== "s") {
      console.log("Eliminación cancelada.");
      return;
    }

    this.#servicio.eliminar(id);
    console.log("Empleado eliminado.");
  }

  #mostrarMenu() {
    console.log("");
    this.#opciones.forEach(({ texto }, i) => console.log(`${i + 1}. ${texto}`));
    console.log("0. Salir");
  }

  async #preguntar(mensaje) {
    this.#entrada.setPrompt(mensaje);
    this.#entrada.prompt();
    const { value, done } = await this.#lineas.next();
    if (done) throw new EntradaCerrada();
    return value.trim();
  }
}
