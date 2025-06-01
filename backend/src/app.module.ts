import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'
import { Usuario } from './usuarios/usuario.entity'
import { UsuariosModule } from './usuarios/usuarios.module'
import { AuthModule } from './auth/auth.module';
import { Jugador } from './jugadores/jugador.entity';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { EquiposModule } from './equipos/equipos.module';
import { Equipo } from './equipos/equipo.entity';
import { Persona } from './personas/persona.entity';
import { PartidosModule } from './partidos/partidos.module';
import { Partido } from './partidos/partido.entity';
import { ScheduleModule } from '@nestjs/schedule';
import { ArbitrosModule } from './arbitros/arbitros.module';
import { Arbitro } from './arbitros/arbitro.entity';
import { Gol } from './partidos/gol.entity';
import { Tarjeta } from './partidos/tarjeta.entity';
import { EstadioModule } from './estadios/estadios.module';
import { Estadio } from './estadios/estadio.entity';
import { JugadoresModule } from './jugadores/jugadores.module';
import { ReportesModule } from './reportes/reportes.module';
import { Reporte } from './reportes/reporte.entity';
/*import { AppController } from './app.controller';
import { AppService } from './app.service';
*/
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mariadb',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'Mastertroll99',
      database: 'deportistas',
      entities: [Usuario, Jugador, Equipo, Persona, Partido, Arbitro, Gol, Tarjeta, Estadio, Reporte],
      synchronize: true
    }),
    ScheduleModule.forRoot(),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads'
    }),
    UsuariosModule,
    AuthModule,
    EquiposModule,
    PartidosModule,
    ArbitrosModule,
    EstadioModule,
    JugadoresModule,
    ReportesModule
  ],
  //controllers: [AppController],
  //providers: [AppService],
})
export class AppModule { }
