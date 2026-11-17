import { randomUUID } from "node:crypto";
import { Empleado } from "../models/Empleado.js";
import { EmpleadoValidator } from "../validators/EmpleadoValidator.js";

export class EmpleadoService {
  #repositorio;
  #validador;

  // Las dependencias se reciben desde fuera (inversión de dependencias).
  constructor(repositorio, validador = new EmpleadoValidator()) {
    this.#repositorio = repositorio;
    this.#validador = validador;
  }

  // RF-01
  registrar(datos) {
    const datosValidos = this.#validador.validar(datos);
    this.#verificarIdentificacionLibre(datosValidos.identificacion);

    const empleado = new Empleado({ id: randomUUID(), ...datosValidos });
    return this.#repositorio.guardar(empleado);
  }

  // RF-02
  listar() {
    return this.#repositorio.obtenerTodos();
  }

  // RF-03
  buscarPorIdentificacion(identificacion) {
    const empleado = this.#repositorio.buscarPorIdentificacion(String(identificacion ?? "").trim());
    if (!empleado) throw new Error("No existe un empleado con esa identificación.");
    return empleado;
  }

  obtenerPorId(id) {
    const empleado = this.#repositorio.buscarPorId(String(id ?? "").trim());
    if (!empleado) throw new Error("No existe un empleado con ese ID.");
    return empleado;
  }

  // RF-04: los campos que no vienen en `cambios` conservan su valor actual.
  actualizar(id, cambios) {
    const empleado = this.obtenerPorId(id);
    const datosValidos = this.#validador.validar({ ...empleado, ...cambios });
    this.#verificarIdentificacionLibre(datosValidos.identificacion, empleado.id);

    return this.#repositorio.actualizar(empleado.id, datosValidos);
  }

  // RF-05
  eliminar(id) {
    const empleado = this.obtenerPorId(id);
    return this.#repositorio.eliminar(empleado.id);
  }

  #verificarIdentificacionLibre(identificacion, idPropio = null) {
    const existente = this.#repositorio.buscarPorIdentificacion(identificacion);
    if (existente && existente.id !== idPropio) {
      throw new Error("Ya existe un empleado con esa identificación.");
    }
  }
}
