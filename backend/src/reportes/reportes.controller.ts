import { Controller, Post, Body, Get, Req, UseGuards, UnauthorizedException, Param, Put } from "@nestjs/common";
import { ReportesService } from "./reportes.service";
import { CreateReporteDto } from "./dto/create-reporte.dto";
import { AuthGuard } from "@nestjs/passport";
import { Request } from "express";
import { Usuario } from "src/usuarios/usuario.entity";
import { UpdateEstadoDto } from "./dto/update-estado.dto";

@Controller('reportes')
@UseGuards(AuthGuard('session'))
export class ReportesController {
    constructor(private reportesService: ReportesService) { }

    @Post()
    async crear(@Body() dto: CreateReporteDto, @Req() req: Request) {
        const usuario = req.session.usuario;
        if (!usuario) throw new UnauthorizedException();
        return this.reportesService.crear(dto, usuario as Usuario);
    }

    @Get('mios')
    async mis(@Req() req: Request) {
        const usuario = req.session.usuario
        if (!usuario) throw new UnauthorizedException()
        return this.reportesService.misReportes(usuario as Usuario)
    }

    @Get('todos')
    async todos(@Req() req: Request) {
        const usuario = req.session.usuario
        if (!usuario || usuario.rol !== 'administrador') throw new UnauthorizedException()
        return this.reportesService.todos()
    }

    @Put(':id/estado')
    async actualizarEstado(
        @Param('id') id: number,
        @Body() { estado }: UpdateEstadoDto,
        @Req() req: Request
    ) {
        const usuario = req.session.usuario
        if (!usuario || usuario.rol !== 'administrador') throw new UnauthorizedException()
        return this.reportesService.actualizarEstado(id, estado)
    }
}