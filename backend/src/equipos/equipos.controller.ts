import { Controller, Post, Body, Req, UseGuards, UnauthorizedException, Get, Param, Put, Delete } from "@nestjs/common";
import { EquiposService } from "./equipos.service";
import { CreateEquipoDto } from "./dto/create-equipo.dto";
import { Request } from "express";
import { UsuariosService } from "src/usuarios/usuarios.service";
import { JoinEquipoDto } from "./dto/join-equipo.dto";
import { UpdateEquipoDto } from "./dto/update-equipo.dts";
import { Equipo } from "./equipo.entity";

const calculaEdad = (fechaNac: string) => {
    const diff = Date.now() - new Date(fechaNac).getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
}

@Controller('equipos')
export class EquiposController {
    constructor(
        private readonly equiposService: EquiposService,
        private readonly usuariosService: UsuariosService
    ) { }

    @Post()
    async crearEquipo(
        @Req() req: Request,
        @Body() dto: CreateEquipoDto
    ) {
        const usuario = req.session.usuario
        if (!usuario) throw new UnauthorizedException('No autenticado')
        const equipo = await this.equiposService.create(usuario.id, dto)
        return { success: true, equipo }
    }

    @Post(":id/salir")
    async salirEquipo(@Req() req: Request, @Param("id") id: number) {
        const usuario = req.session.usuario
        if (!usuario) throw new UnauthorizedException("No autenticado")
        await this.equiposService.salirEquipo(usuario.id, id)
        return { success: true }
    }

    @Post(':id/unirse')
    async join(
        @Req() req: Request,
        @Param('id') id: number,
        @Body() dto: JoinEquipoDto
    ) {
        const usuario = req.session.usuario
        if (!usuario) throw new UnauthorizedException()
        const equipo = await this.equiposService.unirseEquipo(usuario.id, id, dto.claveAcceso)
        return { success: true, equipo }
    }

    @Get(':id/jugadores')
    async listarJugadores(@Param('id') id: number) {
        const jugadores = await this.equiposService.getJugadores(id);
        const lista = jugadores.map(j => {
            const fechaNac = j.usuario.persona?.fechaNac;
            return {
                id: j.id,
                Nombreusu: j.usuario.Nombreusu,
                edad: fechaNac ? calculaEdad(fechaNac) : null,
                posicion: j.posicion,
                numCamiseta: j.numCamiseta,
                piernaBuena: j.piernaBuena,
                persona: {
                    nombre: j.usuario.persona?.nombre,
                    primer_apellido: j.usuario.persona?.primer_apellido,
                    segundo_apellido: j.usuario.persona?.segundo_apellido
                }
            };
        });
        return { jugadores: lista };
    }

    @Get()
    async listarEquipos() {
        return this.equiposService.listarEquipos()
    }

    @Get('mi-equipo')
    async miEquipo(@Req() req: Request) {
        const usuario = req.session.usuario
        if (!usuario) throw new UnauthorizedException()

        const usu = await this.usuariosService.findByIdWithJugador(usuario.id)
        const jugadorId = usu?.jugador?.id
        if (!jugadorId) return { equipo: null, isCaptain: false, estadisticas: null }

        const equipo = await this.equiposService.findMiEquipo(jugadorId)
        if (!equipo) return { equipo: null, isCaptain: false, estadisticas: null }
        const isCaptain = equipo.creadorId === jugadorId
        const estadisticas = await this.equiposService.estadisticas(equipo.id)
        return { equipo, isCaptain, estadisticas }
    }

    @Get('detallado')
    async findAll(): Promise<Equipo[]> {
        return this.equiposService.findAll()
    }

    @Put(':id')
    async actualizarEquipo(
        @Param('id') id: number,
        @Body() dto: UpdateEquipoDto
    ) {
        return this.equiposService.updateEquipo(id, dto)
    }

    @Delete(':id')
    async removeEquipo(
        @Param('id') id: number,
        @Req() req: Request
    ) {
        await this.equiposService.remove(id)
        return { success: true }
    }
}