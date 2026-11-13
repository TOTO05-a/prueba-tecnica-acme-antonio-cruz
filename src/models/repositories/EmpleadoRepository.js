export class EmpleadoRepository {
    constructor() {
        this.empleados = [];
}

guardar(empleado){
    this.empleados.push(empleado); 
    return empleado;
}

obtenerTodos(){
    return [...this.empleados];
}
buscarPorId(id){
    return this.empleados.find(empleado => empleado.id === id);
}

buscarPorIdentificacion(identificacion){
    return this.empleados.find((empleado) => empleado.identificacion === identificacion ?? null);
}

actualizar(id, datos){
    const indice = this.empleados.findIndex((empleado) => empleado.id === id);
    if (indice === -1) return null;
    this.empleados[indice] = { ...this.empleados[indice], ...datos };
    return this.empleados[indice];
}

eliminar(id){
    const indice = this.empleados.findIndex((empleado) => empleado.id === id);
    if (indice === -1) return null;
    
    return this.empleados.splice(indice, 1)[0];
}
}