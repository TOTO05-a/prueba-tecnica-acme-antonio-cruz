import { EmpleadoRepository } from "./repositories/EmpleadoRepository.js";
import { EmpleadoService } from "./services/EmpleadoService.js";
import { EmpleadoController } from "./controllers/EmpleadoController.js";
import { Consola } from "./views/Consola.js";

const empleadoRepository = new EmpleadoRepository();
const empleadoService = new EmpleadoService(empleadoRepository);
const empleadoController = new EmpleadoController(empleadoService);
const aplicacion = new Consola(empleadoController);

try {
  await aplicacion.iniciar();
} catch (error) {
  console.error(`Error en la aplicacion: ${error.message}`);
  process.exitCode = 1;
}
