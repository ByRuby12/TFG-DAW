import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Reporte } from "./reporte.entity";
import { CreateReporteDto } from "./dto/create-reporte.dto";
import { Usuario } from "src/usuarios/usuario.entity";

@Injectable()
export class ReportesService {
    constructor(
        @InjectRepository(Reporte)
        private repo: Repository<Reporte>
    ) { }

    async crear(dto: CreateReporteDto, usuario: Usuario): Promise<Reporte> {
        const r = this.repo.create({ ...dto, usuario })
        return this.repo.save(r)
    }

    async misReportes(usuario: Usuario): Promise<Reporte[]> {
        return this.repo.find({
            where: { usuario: { id: usuario.id } },
            order: { fecha: 'DESC' }
        })
    }

    async todos() {
        return this.repo.find({ relations: ['usuario'], order: { fecha: 'DESC' } })
    }

    async actualizarEstado(id: number, estado: 'Completado' | 'Rechazado' | 'Pendiente') {
        const r = await this.repo.findOneBy({ id })
        if (!r) throw new NotFoundException()
        r.estado = estado
        return this.repo.save(r)
    }
}