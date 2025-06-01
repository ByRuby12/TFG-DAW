import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Jugador } from "./jugador.entity";
import { JugadoresService } from "./jugadores.service";
import { JugadoresController } from "./jugadores.controller";
import { Equipo } from "src/equipos/equipo.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Jugador, Equipo])],
    providers: [JugadoresService],
    controllers: [JugadoresController]
})
export class JugadoresModule { }