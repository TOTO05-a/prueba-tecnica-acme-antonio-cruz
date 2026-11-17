import { EmpleadoRepository } from "./repositories/EmpleadoRepository.js";
import { EmpleadoService } from "./services/EmpleadoService.js";
import { Consola } from "./views/Consola.js";

const servicio = new EmpleadoService(new EmpleadoRepository());
const consola = new Consola(servicio);

try {
  await consola.iniciar();
} catch (error) {
  console.error(`Error inesperado: ${error.message}`);
  process.exitCode = 1;
}
