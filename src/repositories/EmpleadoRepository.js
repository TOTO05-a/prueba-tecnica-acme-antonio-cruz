// Almacenamiento en memoria: los datos viven en un arreglo mientras la aplicación está abierta.
export class EmpleadoRepository {
  #empleados = [];

  guardar(empleado) {
    this.#empleados.push(empleado);
    return empleado;
  }

  obtenerTodos() {
    return [...this.#empleados];
  }

  buscarPorId(id) {
    return this.#empleados.find((empleado) => empleado.id === id) ?? null;
  }

  buscarPorIdentificacion(identificacion) {
    return this.#empleados.find((empleado) => empleado.identificacion === identificacion) ?? null;
  }

  actualizar(id, datos) {
    const empleado = this.buscarPorId(id);
    return empleado ? Object.assign(empleado, datos) : null;
  }

  eliminar(id) {
    const indice = this.#empleados.findIndex((empleado) => empleado.id === id);
    return indice === -1 ? null : this.#empleados.splice(indice, 1)[0];
  }
}
