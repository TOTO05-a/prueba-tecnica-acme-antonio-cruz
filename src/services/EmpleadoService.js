// capa de servicio: registrar, listar, buscar, actualizar y eliminar

import { EmpleadoValidator } from "../validators/EmpleadoValidator.js";

export class EmpleadoService {
  #repositorio;
  #validador;

  // Las dependencias se reciben desde fuera (inversión de dependencias).
  constructor(repositorio, validador = new EmpleadoValidator()) {
    this.#repositorio = repositorio;
    this.#validador = validador;
  }

  // RF-01: el repositorio asigna el ID único.
  registrar(datos) {
    const datosValidos = this.#validador.validar(datos);
    this.#verificarIdentificacionLibre(datosValidos.identificacion);
    return this.#repositorio.guardar(datosValidos);
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
    const empleado = this.#repositorio.buscarPorId(Number(id));
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

  // Valida un campo mientras se escribe. `registrar` y `actualizar` vuelven a validar todo al guardar.
  validarCampo(campo, valor, idActual = null) {
    const limpio = this.#validador.validarCampo(campo, valor);
    if (campo === "identificacion") this.#verificarIdentificacionLibre(limpio, idActual);
    return limpio;
  }

  #verificarIdentificacionLibre(identificacion, idActual = null) {
    const existente = this.#repositorio.buscarPorIdentificacion(identificacion);
    if (existente && existente.id !== idActual) {
      throw new Error("Ya existe un empleado con esa identificación.");
    }
  }
}
