export interface Usuario {
    Nombreusu: string,
    correo: string,
    contrasena: string
}

export function obtenerUsuarios(): Usuario[] {
    return JSON.parse(localStorage.getItem("pruebaregister") || "[]")
}

export function guardarUsuarios(usuarios: Usuario[]): void {
    localStorage.setItem("pruebaregister", JSON.stringify(usuarios))
}

export function agregarUsuario(usuario: Usuario): void {
    const usuarios = obtenerUsuarios()
    usuarios.push(usuario)
    guardarUsuarios(usuarios)
}
