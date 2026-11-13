export class Empleado {
    constructor({
        id,
        identificacion,
        nombres,
        apellidos,
        genero,
        email,
        telefono,
        direccion,
        ciudad,
        profesion,
        cargo,
        salario
  }) {
    this.id = id;
    this.identificacion = identificacion;
    this.nombres = nombres;
    this.apellidos = apellidos;
    this.genero = genero;
    this.email = email;
    this.telefono = telefono;
    this.direccion = direccion;
    this.ciudad = ciudad;
    this.profesion = profesion;
    this.cargo = cargo;
    this.salario = salario;
    }
}