import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from './usuario.entity';
import { UsuariosService } from './usuarios.service';
import { UsuariosController } from './usuarios.controller';
import { CorreoService } from './correo.service';
import { PasswordResetToken } from './password-reset-token.entity';
import { Jugador } from 'src/jugadores/jugador.entity';
import { Persona } from 'src/personas/persona.entity';
import { UsuariosSeed } from './seed';
import { Gol } from 'src/partidos/gol.entity';
import { Tarjeta } from 'src/partidos/tarjeta.entity';
import { Partido } from 'src/partidos/partido.entity';
import { EquiposModule } from 'src/equipos/equipos.module';
import { Equipo } from 'src/equipos/equipo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Usuario, PasswordResetToken, Jugador, Persona, Gol, Tarjeta, Partido, Equipo]), forwardRef(() => EquiposModule)],
  providers: [UsuariosService, CorreoService, UsuariosSeed],
  controllers: [UsuariosController],
  exports: [UsuariosService, TypeOrmModule]
})
export class UsuariosModule { }
