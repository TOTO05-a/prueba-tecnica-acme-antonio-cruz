import test from "node:test";
import assert from "node:assert/strict";
import { EmpleadoRepository } from "../src/repositories/EmpleadoRepository.js";
import { EmpleadoService } from "../src/services/EmpleadoService.js";

const crearServicio = () => new EmpleadoService(new EmpleadoRepository());

const datosValidos = () => ({
    identificacion: "123456",
    nombres: "Antonio",
    apellidos: "Cruz",
    genero: "M",
    email: "ac123@mail.com",
    telefono: "12345678",
    direccion: "San Jose Pinula",
    ciudad: "Guatemala",
    profesion: "Ingeniero",
    cargo: "Desarrollador",
    salario: 6500
});

test("Registrar un empleado y generar un identificador unico", () => {
    const servicio = crearServicio();
    const empleado = servicio.registrar(datosValidos());

    assert.ok(empleado.id);
    assert.equal(empleado.identificacion, "123456");
    assert.equal(servicio.listar().length, 1);
});

test("no se permite registrar identificaciones duplicadas", () => {
    const servicio = crearServicio();
    servicio.registrar(datosValidos());
    
    assert.throws(
        () => servicio.registrar(datosValidos()),
        {
            name: "Error",
            message: "Ya existe un empleado con la misma identificacion"
        }
    );
});

test("valida genero y salario", () => {
    const servicio = crearServicio();
  
    assert.throws(
      () => servicio.registrar({ ...datosValidos(), genero: "X" }),
      /El genero/
    );
  
    assert.throws(
      () => servicio.registrar({ ...datosValidos(), salario: 0 }),
      /salario/
    );
  });
  
  test("busca un empleado por identificacion", () => {
    const servicio = crearServicio();
    servicio.registrar(datosValidos());
  
    assert.equal(servicio.buscarPorIdentificacion("123456").nombres, "Ana");
  });
  
  test("actualiza y elimina un empleado por su id", () => {
    const servicio = crearServicio();
    const empleado = servicio.registrar(datosValidos());
  
    const actualizado = servicio.actualizar(empleado.id, {
      ...datosValidos(),
      cargo: "Coordinadora"
    });
  
    assert.equal(actualizado.cargo, "Coordinadora");
    assert.equal(servicio.eliminar(empleado.id).id, empleado.id);
    assert.equal(servicio.listar().length, 0);
  });
  
  test("no permite nombres vacios ni emails invalidos", () => {
    const servicio = crearServicio();
  
    assert.throws(
      () => servicio.registrar({ ...datosValidos(), nombres: " " }),
      /nombres/
    );
  
    assert.throws(
      () => servicio.registrar({ ...datosValidos(), email: "correo-invalido" }),
      /email/
    );
  });
  