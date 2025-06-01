import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Partido } from "./partido.entity";
import { PartidosService } from "./partidos.service";
import { PartidosController } from "./partidos.controller";
import { ScheduleModule } from "@nestjs/schedule";
import { PartidosSchedulerService } from "./partidos-scheduler.service";
import { EquiposModule } from "src/equipos/equipos.module";
import { UsuariosModule } from "src/usuarios/usuarios.module";
import { Gol } from "./gol.entity";
import { Tarjeta } from "./tarjeta.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Partido, Gol, Tarjeta]), ScheduleModule, EquiposModule, UsuariosModule],
    providers: [PartidosService, PartidosSchedulerService],
    controllers: [PartidosController],
})
export class PartidosModule { }