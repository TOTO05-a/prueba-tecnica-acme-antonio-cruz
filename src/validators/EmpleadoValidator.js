const GENEROS = ["M", "F", "O"];
const FORMATO_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Campos de texto obligatorios y el nombre con el que se muestran en los errores.
const CAMPOS_OBLIGATORIOS = {
  identificacion: "identificación",
  nombres: "nombres", // RN-01
  apellidos: "apellidos", // RN-01
  genero: "género",
  email: "email", // RN-03
  telefono: "teléfono", // RN-03
  direccion: "dirección", // RN-03
  ciudad: "ciudad de residencia", // RN-03
  profesion: "profesión", // RN-04
  cargo: "cargo", // RN-04
};

// Aplica las reglas de negocio y devuelve los datos limpios (sin espacios sobrantes).
export class EmpleadoValidator {
  validar(datos = {}) {
    const resultado = {};

    for (const [campo, nombre] of Object.entries(CAMPOS_OBLIGATORIOS)) {
      const valor = String(datos[campo] ?? "").trim();
      if (!valor) throw new Error(`El campo ${nombre} es obligatorio.`);
      resultado[campo] = valor;
    }

    // RN-02
    resultado.genero = resultado.genero.toUpperCase();
    if (!GENEROS.includes(resultado.genero)) {
      throw new Error('El género debe ser "M", "F" u "O".');
    }

    if (!FORMATO_EMAIL.test(resultado.email)) {
      throw new Error("El email no tiene un formato válido.");
    }

    // RN-05
    const salario = Number(datos.salario);
    if (!Number.isFinite(salario) || salario <= 0) {
      throw new Error("El salario debe ser un número mayor que 0.");
    }
    resultado.salario = salario;

    return resultado;
  }
}
