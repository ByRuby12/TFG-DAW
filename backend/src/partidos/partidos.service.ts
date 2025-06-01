import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Not, Repository } from "typeorm";
import { Partido, EstadoPartido } from "./partido.entity";
import { CreatePartidoDto } from "./dto/create-partido.dto";
import { GuardarResultadosDto } from "./dto/guardar-resultados.dto";
import { UpdatePartidoDto } from "./dto/update-partido.dto";
import { Gol } from "./gol.entity";
import { Tarjeta } from "./tarjeta.entity";

@Injectable()
export class PartidosService {
    constructor(
        @InjectRepository(Partido)
        private repo: Repository<Partido>
    ) {}

    async create(userId: number, dto: CreatePartidoDto) {
    const partido = this.repo.create({ ...dto, creadorId: userId });
    if(dto.arbitroId) {
        partido.estado = EstadoPartido.ASIGNADO
    }
    return this.repo.save(partido);
    }

    /*
    async findMy(userId: number) {
        return this.repo.find({ where: { creadorId: userId }, relations: ['equipoLocal', 'equipoVisitante'] })
    }
    */
    async findComunity(userId: number): Promise<Partido[]> {
    return this.repo.find({
      where: { creadorId: Not(userId) },
      relations: ['equipoLocal', 'equipoVisitante']
    })
    }

    async findMisPartidos(capitanId:number): Promise<Partido[]>{
        return this.repo.find({
            where: { creadorId: capitanId },
            relations: ['equipoLocal', 'equipoVisitante']
        })
    }

    async findByTeam(teamId: number): Promise<Partido[]> {
        return this.repo.find({
            where: [
                { equipoLocalId: teamId },
                { equipoVisitanteId: teamId }
            ],
            relations: ['equipoLocal', 'equipoVisitante']
        })
    }

    async findOthers(teamId: number): Promise<Partido[]> {
        return this.repo.createQueryBuilder('p')
                                                .leftJoinAndSelect('p.equipoLocal', 'el')
                                                .leftJoinAndSelect('p.equipoVisitante', 'ev')
                                                .where('p.equipoLocalId != :id AND p.equipoVisitanteId != :id', { id: teamId })
                                                .getMany()
    }

    async asignarArbitro(partidoId: number, arbitroId) {
        const p = await this.repo.findOne({ where: { id: partidoId } })
        if(!p) throw new NotFoundException()
        p.arbitroId = arbitroId
        p.estado = EstadoPartido.ASIGNADO
        return this.repo.save(p)
    }

    async rechazar(partidoId: number) {
        const p = await this.repo.findOne({ where: { id: partidoId } })
        if(!p) throw new NotFoundException()
        p.estado = EstadoPartido.RECHAZADO
        return this.repo.save(p)
    }

    async guardarResultados(dto: GuardarResultadosDto) {
    const p = await this.repo.findOne({
        where: { id: dto.partidoId },
        
    });
        if(!p) throw new NotFoundException()

        await this.repo.manager.getRepository(Gol).delete({
        partidoId: dto.partidoId,
        })

        await this.repo.manager.getRepository(Tarjeta).delete({
        partidoId: dto.partidoId,
        })
    const nuevosGoles: Gol[] = (dto.goles ?? []).map((gData) => {
      const gol = new Gol();
      gol.equipo = gData.equipo;
      gol.jugador = gData.jugador;
      gol.asistidoPor = gData.asistidoPor
      gol.tipo = gData.tipo as "normal" | "penalti" | "falta" | "corner";
      gol.minuto = gData.minuto;
      gol.partidoId = dto.partidoId;
      return gol;
    })
    const nuevasTarjetas: Tarjeta[] = (dto.tarjetas ?? []).map((tData) => {
      const tar = new Tarjeta();
      tar.equipo = tData.equipo;
      tar.jugador = tData.jugador;
      tar.tipo = tData.tipo as "amarilla" | "roja";
      tar.minuto = tData.minuto;
      tar.partidoId = dto.partidoId;
      return tar;
    })

    if (nuevosGoles.length > 0) {
    await this.repo.manager.getRepository(Gol).save(nuevosGoles);
    }

    if (nuevasTarjetas.length > 0) {
    await this.repo.manager.getRepository(Tarjeta).save(nuevasTarjetas);
    }
        p.estado = EstadoPartido.TERMINADO
        return this.repo.save(p)
    }

    async listarParaArbitro(arbitroId: number) {
        return this.repo.find({
            where: [
                { arbitroId, estado: EstadoPartido.ASIGNADO },
                { arbitroId, estado: EstadoPartido.PENDIENTE}
            ],
            relations: ['equipoLocal', 'equipoVisitante', 'goles', 'tarjetas']
        })
    }

    findAll(): Promise<Partido[]>{
        return this.repo.find({ relations: ['equipoLocal', 'equipoVisitante'] })
    }

    async updatePartido(id:number, dto:UpdatePartidoDto): Promise<Partido>{
        const p = await this.repo.findOne({ where: { id } })
        if(!p) throw new NotFoundException(`Partido ${id} no encontrado`)
        Object.assign(p, dto)
        return this.repo.save(p)
    }

    async remove(id:number): Promise<void> {
        await this.repo.delete(id)
    }
}