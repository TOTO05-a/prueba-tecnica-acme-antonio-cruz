import { test } from "node:test";
import assert from "node:assert/strict";
import { EmpleadoRepository } from "../src/repositories/EmpleadoRepository.js";
import { EmpleadoService } from "../src/services/EmpleadoService.js";

const crearServicio = () => new EmpleadoService(new EmpleadoRepository());

const datosValidos = (cambios = {}) => ({
  identificacion: "123456",
  nombres: "Antonio",
  apellidos: "Cruz",
  genero: "M",
  email: "ac123@mail.com",
  telefono: "12345678",
  direccion: "San José Pinula",
  ciudad: "Guatemala",
  profesion: "Ingeniero",
  cargo: "Desarrollador",
  salario: "6500",
  ...cambios,
});

test("RF-01: registra un empleado con un ID único", () => {
  const servicio = crearServicio();
  const a = servicio.registrar(datosValidos());
  const b = servicio.registrar(datosValidos({ identificacion: "999" }));

  assert.ok(a.id);
  assert.notEqual(a.id, b.id);
  assert.equal(a.salario, 6500);
});

test("RF-01: no permite identificaciones duplicadas", () => {
  const servicio = crearServicio();
  servicio.registrar(datosValidos());

  assert.throws(() => servicio.registrar(datosValidos()), /Ya existe/);
});

test("RF-02: lista los empleados registrados", () => {
  const servicio = crearServicio();
  assert.equal(servicio.listar().length, 0);

  servicio.registrar(datosValidos());
  assert.equal(servicio.listar().length, 1);
});

test("RF-03: busca por identificación", () => {
  const servicio = crearServicio();
  servicio.registrar(datosValidos());

  assert.equal(servicio.buscarPorIdentificacion(" 123456 ").nombres, "Antonio");
  assert.throws(() => servicio.buscarPorIdentificacion("000"), /No existe/);
});

test("RF-04: actualiza solo los campos indicados", () => {
  const servicio = crearServicio();
  const { id } = servicio.registrar(datosValidos());

  const actualizado = servicio.actualizar(id, { cargo: "Líder técnico" });

  assert.equal(actualizado.cargo, "Líder técnico");
  assert.equal(actualizado.nombres, "Antonio");
  assert.throws(() => servicio.actualizar("id-inexistente", {}), /No existe/);
});

test("RF-04: valida las reglas y la identificación duplicada al actualizar", () => {
  const servicio = crearServicio();
  const { id } = servicio.registrar(datosValidos());
  servicio.registrar(datosValidos({ identificacion: "999" }));

  assert.throws(() => servicio.actualizar(id, { salario: "0" }), /salario/);
  assert.throws(() => servicio.actualizar(id, { identificacion: "999" }), /Ya existe/);
  assert.equal(servicio.obtenerPorId(id).salario, 6500); // no cambió
});

test("RF-05: elimina por ID único", () => {
  const servicio = crearServicio();
  const { id } = servicio.registrar(datosValidos());

  assert.equal(servicio.eliminar(id).id, id);
  assert.equal(servicio.listar().length, 0);
  assert.throws(() => servicio.eliminar(id), /No existe/);
});

test("RN-01: nombres y apellidos no pueden estar vacíos", () => {
  const servicio = crearServicio();
  assert.throws(() => servicio.registrar(datosValidos({ nombres: "  " })), /nombres/);
  assert.throws(() => servicio.registrar(datosValidos({ apellidos: "" })), /apellidos/);
});

test("RN-02: el género debe ser M, F u O", () => {
  const servicio = crearServicio();
  assert.throws(() => servicio.registrar(datosValidos({ genero: "X" })), /género/);
  assert.equal(servicio.registrar(datosValidos({ genero: "f" })).genero, "F");
});

test("RN-03: los datos de contacto son obligatorios", () => {
  const servicio = crearServicio();
  for (const campo of ["email", "telefono", "direccion", "ciudad"]) {
    assert.throws(() => servicio.registrar(datosValidos({ [campo]: "" })), /obligatorio/);
  }
  assert.throws(() => servicio.registrar(datosValidos({ email: "correo-invalido" })), /email/);
});

test("RN-04: profesión y cargo son obligatorios", () => {
  const servicio = crearServicio();
  assert.throws(() => servicio.registrar(datosValidos({ profesion: "" })), /profesión/);
  assert.throws(() => servicio.registrar(datosValidos({ cargo: "" })), /cargo/);
});

test("RN-05: el salario debe ser mayor que 0", () => {
  const servicio = crearServicio();
  for (const salario of ["0", "-100", "abc", ""]) {
    assert.throws(() => servicio.registrar(datosValidos({ salario })), /salario/);
  }
});
