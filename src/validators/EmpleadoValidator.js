const GENEROS = ["M", "F", "O"];
const FORMATO_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const FORMATO_SALARIO = /^\d+(\.\d{1,2})?$/; // 6500 o 6500.50, sin separador de miles

// Campos obligatorios y el nombre con el que se muestran en los errores.
const CAMPOS = {
  identificacion: "identificación",
  nombres: "nombres", // RN-01
  apellidos: "apellidos", // RN-01
  genero: "género", // RN-02
  email: "email", // RN-03
  telefono: "teléfono", // RN-03
  direccion: "dirección", // RN-03
  ciudad: "ciudad de residencia", // RN-03
  profesion: "profesión", // RN-04
  cargo: "cargo", // RN-04
  salario: "salario", // RN-05
};

// Aplica las reglas de negocio y devuelve los datos limpios (sin espacios sobrantes).
export class EmpleadoValidator {
  // Valida todos los campos de un empleado.
  validar(datos = {}) {
    const resultado = {};
    for (const campo of Object.keys(CAMPOS)) {
      resultado[campo] = this.validarCampo(campo, datos[campo]);
    }
    return resultado;
  }

  // Valida un solo campo; la consola lo usa para avisar del error en cuanto se escribe.
  validarCampo(campo, valor) {
    const texto = String(valor ?? "").trim();
    if (!texto) throw new Error(`El campo ${CAMPOS[campo]} es obligatorio.`);

    switch (campo) {
      case "genero": {
        const genero = texto.toUpperCase();
        if (!GENEROS.includes(genero)) throw new Error('El género debe ser "M", "F" u "O".');
        return genero;
      }
      case "email":
        if (!FORMATO_EMAIL.test(texto)) throw new Error("El email no tiene un formato válido.");
        return texto;
      case "salario": {
        const salario = Number(texto);
        if (!FORMATO_SALARIO.test(texto) || salario <= 0) {
          throw new Error("El salario debe ser un número mayor que 0, sin separador de miles (ej.: 6500 o 6500.50).");
        }
        return salario;
      }
      default:
        return texto;
    }
  }
}
