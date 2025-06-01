import 'express-session'

declare module 'express-session' {
    interface SessionData {
        usuario: {
            id: number,
            Nombreusu: string,
            correo: string,
            rol: 'administrador' | 'jugador' | 'arbitro'
        }
    }
}
