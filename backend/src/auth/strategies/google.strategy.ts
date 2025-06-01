import { PassportStrategy } from "@nestjs/passport";
import { Strategy, VerifyCallback } from "passport-google-oauth20";
import { Injectable } from "@nestjs/common";
import { UsuariosService } from "src/usuarios/usuarios.service";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor(private readonly usuariosService: UsuariosService) {
        super({
            clientID: '690354596166-ad6gssuh5idafmsuqaf1c441pc5g2slf.apps.googleusercontent.com',
            clientSecret: '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',
            callbackURL: 'http://localhost:3000/auth/google/redirect',
            scope: ['email', 'profile']
        })
    }

    async validate(accesToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
        const { emails, displayName } = profile
        const correo = emails[0].value
        let usuario = await this.usuariosService.findByCorreo(correo)
        if (!usuario) {
            usuario = await this.usuariosService.crearDesdeGoogle({
                Nombreusu: displayName,
                correo,
                confirmado: true
            })
        }
        done(null, usuario)
    }
}