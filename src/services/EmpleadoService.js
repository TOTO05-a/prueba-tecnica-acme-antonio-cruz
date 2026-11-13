import { randomUUID } from "crypto"; //para crear identificadores unicos 
import { Empleado } from "../models/Empleado.js";

const camposObligatorios = [
  "identificacion",
  "nombres",
  "apellidos",
  "genero",
  "email",
  "telefono",
  "direccion",
  "ciudad",
  "profesion",
  "cargo"
];

export class EmpleadoService {
    constructor(empleadoRepository) {
        this.empleadoRepository = empleadoRepository;
    }

    registrar(datos){
        const empleadoValidado = this.validarDatos(datos);

    if (this.empleadoRepository.buscarPorIdentificacion(empleadoValidado.identificacion)) {
      throw new Error("Ya existe un empleado con esa identificacion.");
    }

    const empleado = new Empleado({
      id: randomUUID(),
      ...empleadoValidado
    });
    return this.empleadoRepository.guardar(empleado);
  }

  listar() {
    return this.empleadoRepository.obtenerTodos();
  }

  buscarPorIdentificacion(identificacion) {
    const valor = this.texto(identificacion, "identificacion");
    const empleado = this.empleadoRepository.buscarPorIdentificacion(valor);

    if (!empleado) throw new Error("No se encontro un empleado con esa identificacion.");
    return empleado;
  }

obtenerPorId(id) {
    const empleado = this.empleadoRepository.buscarPorId(id);
    if (!empleado) throw new Error("No se encontro un empleado con ese id.");
    return empleado;
  }

  actualizar(id, datos) {
    const empleadoActual = this.empleadoRepository.buscarPorId(id);
    if (!empleadoActual) throw new Error("No se encontro un empleado indicado.");
    const datosActualizados = this.validarDatos({
        ...empleadoActual,
        ...datos
        });
        const empleadoDuplicado = this.empleadoRepository.buscarPorIdentificacion(datosActualizados.identificacion);
        if (empleadoDuplicado && empleadoDuplicado.id !== id) {
            throw new Error("Ya existe un empleado con esa identificacion.");
        }
        return this.empleadoRepository.actualizar(id, datosActualizados);
    }

    eliminar(id) {
        const empleado = this.empleadoRepository.eliminar(id);
        if (!empleado) throw new Error("No se encontro un empleado con ese id.");
        return empleado;
    }

    validarDatos(datos) {
        if (!datos || typeof datos !== "object" || Array.isArray(datos)) {
            throw new Error("Los datos del empleado deben ser proporcionados.");
        }

        const resultado = {};
        for (const campo of camposObligatorios) {
            resultado[campo] = this.texto(datos[campo], campo);
        }

        resultado.genero = resultado.genero.toUpperCase();
    if (!["M", "F", "O"].includes(resultado.genero)) {
      throw new Error("El genero debe ser M, F u O.");
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(resultado.email)) {
        throw new Error("El email no tiene un formato valido.");
      }
      
      resultado.salario = Number(datos.salario);
      if (!Number.isFinite(resultado.salario) || resultado.salario < 0) {
        throw new Error("El salario debe ser un numero superior a 0.");
        }
        return resultado;
    }

    texto(valor, campo) {
        if (typeof valor !== "string" || !valor.trim()) {
            throw new Error(`El campo ${campo} es obligatorio.`);
        }
        return valor.trim();
    }
}