import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class CorreoService {
  // Transportador de correo
  private transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'raul.magallon@gmail.com',
      pass: 'hecf pljz qqpx zlai',
    },
  });

  async enviarConfirmacion(correo: string, usuario: string) {
    await this.transporter.sendMail({
      from: 'Deportistas del Barrio <deportistasdelbarrio@gmail.com>',
      to: correo,
      subject: 'Confirma tu cuenta en Deportistas del Barrio',
      html: `
        <div style="font-family: Arial, sans-serif; background: #f6f8fa; padding: 32px 0;">
          <div style="max-width: 480px; margin: auto; background: #fff; border-radius: 12px; box-shadow: 0 2px 8px #0001; padding: 32px 24px;">
            <div style="text-align: center; margin-bottom: 24px;">
              <img src="https://i.ibb.co/dJWkmc5f/logo.png" alt="Logo Deportistas del Barrio" style="width: 80px; height: 80px; border-radius: 16px; margin-bottom: 8px;"/>
              <h1 style="color: #2d3a4a; font-size: 2rem; margin: 0;">¡Bienvenido, ${usuario}!</h1>
            </div>
            <p style="font-size: 1.1rem; color: #333;">Gracias por registrarte en <b>Deportistas del Barrio</b>. Para activar tu cuenta y comenzar a disfrutar de la comunidad, por favor confirma tu correo electrónico haciendo clic en el siguiente botón:</p>
            <div style="text-align: center; margin: 32px 0;">
              <a href="http://localhost:3000/usuarios/confirmar/${usuario}" style="background: #4f46e5; color: #fff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: bold; font-size: 1.1rem; display: inline-block;">Confirmar cuenta</a>
            </div>
            <p style="color: #555; font-size: 0.98rem;">Si no te has registrado en nuestra plataforma, puedes ignorar este mensaje.</p>
            <hr style="margin: 32px 0 16px 0; border: none; border-top: 1px solid #eee;"/>
            <div style="text-align: center; color: #888; font-size: 0.95rem;">
              <p>Un saludo deportivo,<br>El equipo de <b>Deportistas del Barrio</b></p>
              <p style="margin-top: 8px; font-size: 0.9rem;">&copy; ${new Date().getFullYear()} Deportistas del Barrio</p>
            </div>
          </div>
        </div>
      `,
    });
  }

  async enviarCodigo(correo: string, codigo: string) {
    await this.transporter.sendMail({
      from: 'Recuperación de cuenta - Deportistas del Barrio <deportistasdelbarrio@gmail.com>',
      to: correo,
      subject: 'Recupera tu contraseña en Deportistas del Barrio',
      html: `
        <div style="font-family: Arial, sans-serif; background: #f6f8fa; padding: 32px 0;">
          <div style="max-width: 480px; margin: auto; background: #fff; border-radius: 12px; box-shadow: 0 2px 8px #0001; padding: 32px 24px;">
            <div style="text-align: center; margin-bottom: 24px;">
              <img src="https://i.ibb.co/dJWkmc5f/logo.png" alt="Logo Deportistas del Barrio" style="width: 80px; height: 80px; border-radius: 16px; margin-bottom: 8px;"/>
              <h1 style="color: #2d3a4a; font-size: 2rem; margin: 0;">Recuperación de contraseña</h1>
            </div>
            <p style="font-size: 1.1rem; color: #333;">Hemos recibido una solicitud para restablecer la contraseña de tu cuenta en <b>Deportistas del Barrio</b>.</p>
            <p style="font-size: 1.1rem; color: #333;">Tu código de recuperación es:</p>
            <div style="text-align: center; margin: 32px 0;">
              <span style="display: inline-block; background: #4f46e5; color: #fff; font-size: 2rem; font-weight: bold; padding: 16px 40px; border-radius: 10px; letter-spacing: 2px;">${codigo}</span>
            </div>
            <p style="color: #555; font-size: 0.98rem;">Este código es válido por 10 minutos. Si tú no solicitaste este código, puedes ignorar este mensaje.</p>
            <hr style="margin: 32px 0 16px 0; border: none; border-top: 1px solid #eee;"/>
            <div style="text-align: center; color: #888; font-size: 0.95rem;">
              <p>Un saludo deportivo,<br>El equipo de <b>Deportistas del Barrio</b></p>
              <p style="margin-top: 8px; font-size: 0.9rem;">&copy; ${new Date().getFullYear()} Deportistas del Barrio</p>
            </div>
          </div>
        </div>
      `
    })
  }
}