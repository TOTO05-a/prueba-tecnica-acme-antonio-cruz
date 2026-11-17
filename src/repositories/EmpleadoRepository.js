import { Empleado } from "../models/Empleado.js";

// Almacenamiento en memoria: los datos viven en un arreglo mientras la aplicación está abierta.
// Entrega copias para que nadie modifique un empleado sin pasar por el servicio.
export class EmpleadoRepository {
  #empleados = [];
  #siguienteId = 1; // como un AUTO_INCREMENT: nunca se reutiliza, aunque se elimine un empleado

  guardar(datos) {
    const empleado = new Empleado({ ...datos, id: this.#siguienteId++ });
    this.#empleados.push(empleado);
    return this.#copiar(empleado);
  }

  obtenerTodos() {
    return this.#empleados.map((empleado) => this.#copiar(empleado));
  }

  buscarPorId(id) {
    return this.#copiar(this.#empleados.find((empleado) => empleado.id === id));
  }

  buscarPorIdentificacion(identificacion) {
    return this.#copiar(this.#empleados.find((empleado) => empleado.identificacion === identificacion));
  }

  actualizar(id, datos) {
    const empleado = this.#empleados.find((e) => e.id === id);
    return empleado ? this.#copiar(Object.assign(empleado, datos)) : null;
  }

  eliminar(id) {
    const indice = this.#empleados.findIndex((empleado) => empleado.id === id);
    return indice === -1 ? null : this.#empleados.splice(indice, 1)[0];
  }

  #copiar(empleado) {
    return empleado ? new Empleado({ ...empleado }) : null;
  }
}
