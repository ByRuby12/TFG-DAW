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
      from: '"Deportistas del barrio 👋" <deportistasdelbarrio@gmail.com>',
      to: correo,
      subject: 'Confirma tu cuenta',
      html: `
        <h2>Hola ${usuario}</h2>
        <p>Gracias por registrarte. Haz clic en el siguiente enlace para confirmar tu cuenta:</p>
        <a href="http://localhost:3000/usuarios/confirmar/${usuario}">Confirmar cuenta</a>
      `,
    });
  }

  async enviarCodigo(correo: string, codigo: string) {
    await this.transporter.sendMail({
      from: '"Recuperación de cuenta - Deportistas del Barrio" <deportistasdelbarrio@gmail.com>',
      to: correo,
      subject: 'Tu código para recuperar la contraseña',
      html: `
        <h2>Recuperación de contraseña</h2>
        <p>Hemos recibido una solicitud para restablecer tu contraseña.</p>
        <p>Tu código de recuperación es:</p>
        <h3 style="color: #007bff;">${codigo}</h3>
        <p>Este código es válido por 10 minutos. Si tú no solicitaste este código, puedes ignorar este mensaje.</p>
        <br/>
        <p>Saludos,</p>
        <p>El equipo de Deportistas del Barrio</p>
      `
    })
  }
}