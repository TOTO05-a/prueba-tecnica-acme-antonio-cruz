export class EmpleadoController {
  constructor(empleadoService) {
    this.empleadoService = empleadoService;
  }
  
  registrar(datos) {
    return this.empleadoService.registrar(datos);
    }

    listar() {
        return this.empleadoService.listar();
    }

    buscar(identificacion) {
        return this.empleadoService.buscarPorIdentificacion(identificacion);
    }

    obtener(id) {
        return this.empleadoService.obtenerPorId(id);
    }

    actualizar(id, datos) {
        return this.empleadoService.actualizar(id, datos);
    }

    eliminar(id) {
        return this.empleadoService.eliminar(id);
    }
}