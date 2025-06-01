import { Injectable, OnModuleInit } from "@nestjs/common";
import { UsuariosService } from "./usuarios.service";
import { RolUsuario, Usuario } from "./usuario.entity";
import { Persona } from "src/personas/persona.entity";

@Injectable()
export class UsuariosSeed implements OnModuleInit {
  constructor(private readonly usuariosService: UsuariosService) { }

  async onModuleInit() {
    const arbitros: Array<{
      Nombreusu: string;
      correo: string;
      contrasena: string;
      rol: RolUsuario;
      persona: Partial<Persona>;
    }> = [{
      Nombreusu: 'carlos.martinez',
      correo: 'carlos.martinez@example.com',
      contrasena: '123456',
      rol: RolUsuario.ARBITRO,
      persona: {
        nombre: 'Carlos',
        primer_apellido: 'Martínez',
        segundo_apellido: '',
        fechaNac: ('1980-07-15'),
        sexo: 'hombre',
        peso: 75,
        altura: 178,
        municipio: 'Madrid',
        direccion: 'Calle Falsa 123',
        biografia: 'Árbitro federado con 10 años de experiencia.'
      }
    },
    {
      Nombreusu: 'ana.garcia',
      correo: 'ana.garcia@example.com',
      contrasena: '123456',
      rol: RolUsuario.ARBITRO,
      persona: {
        nombre: 'Ana',
        primer_apellido: 'García',
        segundo_apellido: '',
        fechaNac: '1985-03-22',
        sexo: 'mujer',
        peso: 65,
        altura: 165,
        municipio: 'Barcelona',
        direccion: 'Av. Siempre Viva 742',
        biografia: 'Árbitra nacional, forma parte de la liga regional.'
      }
    }]
    for (const a of arbitros) {
      const existe = await this.usuariosService.findByNombreusu(a.Nombreusu)
      if (!existe) {
        const creado = await this.usuariosService.register({
          Nombreusu: a.Nombreusu,
          correo: a.correo,
          contrasena: a.contrasena
        })
        await this.usuariosService.confirmarUsuario(creado.Nombreusu)
        await this.usuariosService.updateRol(creado.id, a.rol)
        await this.usuariosService.updatePersona(creado.id, {
          ...a.persona,
          fechaNac: a.persona.fechaNac || '2000-01-01'
        })
      }
    }
  }
}