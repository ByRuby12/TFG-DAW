import { Controller, Post, Get, Body, Req, UnauthorizedException, Param, Put, Delete } from "@nestjs/common";
import { PartidosService } from "./partidos.service";
import { EquiposService } from "src/equipos/equipos.service";
import { CreatePartidoDto } from "./dto/create-partido.dto";
import { Request } from "express";
import { UsuariosService } from "src/usuarios/usuarios.service";
import { GuardarResultadosDto } from "./dto/guardar-resultados.dto";
import { Partido } from "./partido.entity";
import { UpdatePartidoDto } from "./dto/update-partido.dto";

@Controller('partidos')
export class PartidosController {
    constructor(
        private readonly partidosService: PartidosService,
        private readonly equiposService: EquiposService,
        private readonly usuariosService: UsuariosService
    ) {}

    @Post()
    async create(@Req() req: Request, @Body() dto: CreatePartidoDto) {
        const user = req.session.usuario
        if(!user) throw new UnauthorizedException()
        return this.partidosService.create(user.id, dto)
    }

    @Post(':id/asignar/:arb')
    asignar(@Param('id') id:number, @Param('arb') arb: number) {
        return this.partidosService.asignarArbitro(id, arb)
    }

    @Post(':id/rechazar')
    rechazar(@Param('id') id:number) {
        return this.partidosService.rechazar(id)
    }

    @Post('resultados')
    guardarResultados(@Body() dto: GuardarResultadosDto) {
        return this.partidosService.guardarResultados(dto)
    }

    @Get('mios')
    async misPartidos(@Req() req: Request) {
        const user = req.session.usuario
        if(!user) throw new UnauthorizedException()
        const usu = await this.usuariosService.findByIdWithJugador(user.id)
        if(!usu?.jugador) return []
        const equipo = await this.equiposService.findMiEquipo(usu.jugador.id)
        if(!equipo) return []
        return this.partidosService.findByTeam(equipo.id)
    }

    @Get('comunitarios')
    async comunitarios(@Req() req: Request) {
        const user = req.session.usuario
        if(!user) throw new UnauthorizedException()
        const usu = await this.usuariosService.findByIdWithJugador(user.id)
        if(!usu?.jugador) return []
        const equipo = await this.equiposService.findMiEquipo(usu.jugador.id)
        if(!equipo) return []
        return this.partidosService.findOthers(equipo.id)
    }

    @Get('arbitro')
    listarAsignados(@Req() req: Request) {
        const u = req.session.usuario
        if(!u) throw new UnauthorizedException()
        return this.partidosService.listarParaArbitro(u.id)
    }

    @Get()
    async findAll(): Promise<Partido[]>{
        return this.partidosService.findAll()
    }

    @Put(':id')
    async updatePartido(
        @Param('id') id:number,
        @Body() dto: UpdatePartidoDto
    ) {
        const hasResults = dto.goles !== undefined || dto.tarjetas !== undefined
        if(hasResults) {
            const resultadosDto = {
                partidoId: id,
                goles: dto.goles ?? [],
                tarjetas: dto.tarjetas ?? []
            }
            return this.partidosService.guardarResultados(resultadosDto)
        }
        return this.partidosService.updatePartido(id, dto)
    }

    @Delete(':id')
    async removePartido(@Param('id') id:number) {
        await this.partidosService.remove(id)
        return { success: true }
    }
}