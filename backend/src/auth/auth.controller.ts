import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { UsuariosService } from 'src/usuarios/usuarios.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly usuariosService: UsuariosService) { }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() { }

  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  async googleRedirect(@Req() req, @Res() res: Response) {
    const user = req.user as any;

    req.session.usuario = {
      id: user.id,
      Nombreusu: user.Nombreusu ?? user.Nombre_usu,
      correo: user.correo ?? user.email,
      rol: user.rol
    }

    await new Promise<void>((resolve, reject) => {
      req.session.save(err => {
        if (err) {
          console.error('Error al guardar sesión de Google:', err)
          return reject(err)
        }
        resolve()
      })
    })

    const usuarioExistente = await this.usuariosService.findByCorreo(user.email)

    if (!usuarioExistente) {

      return res.redirect(`http://localhost:5173/register?google=true&email=${encodeURIComponent(user.email)}`);
    }

    const nombreusu = usuarioExistente.Nombreusu || 'usuario';
    return res.redirect(`http://localhost:5173/?loginGoogle=true&nombreusu=${encodeURIComponent(nombreusu)}`);
  }
}