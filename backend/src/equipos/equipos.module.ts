import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EquiposController } from "./equipos.controller";
import { EquiposService } from "./equipos.service";
import { Equipo } from "./equipo.entity";
import { UsuariosModule } from "src/usuarios/usuarios.module";
import { Partido } from "src/partidos/partido.entity";
import { Usuario } from "src/usuarios/usuario.entity";
import { Jugador } from "src/jugadores/jugador.entity";
import { UsuariosService } from "src/usuarios/usuarios.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([Equipo, Partido]),
        forwardRef(() => UsuariosModule)
    ],
    controllers: [EquiposController],
    providers: [EquiposService],
    exports: [EquiposService]
})
export class EquiposModule { }