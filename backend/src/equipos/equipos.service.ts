import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Equipo } from './equipo.entity';
import { CreateEquipoDto } from './dto/create-equipo.dto';
import { UsuariosService } from 'src/usuarios/usuarios.service';
import { Jugador } from 'src/jugadores/jugador.entity';
import { UpdateEquipoDto } from './dto/update-equipo.dts';
import { EstadoPartido, Partido } from 'src/partidos/partido.entity';

@Injectable()
export class EquiposService {
  constructor(
    @InjectRepository(Equipo)
    private equiposRepo: Repository<Equipo>,
    private usuariosService: UsuariosService,
    @InjectRepository(Partido)
    private partidosRepo: Repository<Partido>,
  ) {}

  async create(sessionUsuarioId: number, dto: CreateEquipoDto): Promise<Equipo> {
    const usuario = await this.usuariosService.findByIdWithJugador(sessionUsuarioId);
    if (!usuario?.jugador) {
      throw new UnauthorizedException('Perfil de jugador incompleto');
    }
    const creadorId = usuario.jugador.id;
    const equipo = this.equiposRepo.create({ ...dto, creadorId });
    await this.equiposRepo.save(equipo);
    await this.equiposRepo
      .createQueryBuilder()
      .relation(Equipo, 'jugadores')
      .of(equipo.id)
      .add(creadorId);
    return equipo;
  }

  async getJugadores(equipoId: number): Promise<Jugador[]> {
    const equipo = await this.equiposRepo.findOne({
      where: { id: equipoId },
      relations: [
        'jugadores',
        'jugadores.usuario',
        'jugadores.usuario.persona',
      ],
    });
    return equipo?.jugadores || [];
  }

  async findMiEquipo(jugadorId: number): Promise<Equipo | null> {
    return this.equiposRepo
      .createQueryBuilder('e')
      .innerJoin('e.jugadores', 'j', 'j.id = :jugadorId', { jugadorId })
      .getOne();
  }

  async salirEquipo(sessionUsuarioId: number, equipoId: number): Promise<void> {
    const usuario = await this.usuariosService.findByIdWithJugador(sessionUsuarioId);
    const jugadorId = usuario?.jugador?.id;
    if (!jugadorId) throw new UnauthorizedException('Perfil de jugador incompleto');

    // Eliminar al jugador del equipo
    await this.equiposRepo
      .createQueryBuilder()
      .relation(Equipo, 'jugadores')
      .of(equipoId)
      .remove(jugadorId);

    // Cargar los jugadores restantes
    const restantes = await this.equiposRepo
      .createQueryBuilder()
      .relation(Equipo, 'jugadores')
      .of(equipoId)
      .loadMany<Jugador>();

    if (restantes.length === 0) {
      // Si no quedan jugadores, verificar si hay partidos asociados
      const asociados = await this.partidosRepo.count({
        where: [
          { equipoLocalId: equipoId },
          { equipoVisitanteId: equipoId },
        ],
      });
      if (asociados > 0) {
        throw new BadRequestException(
          `No puedes salir ni eliminar el equipo porque eres el último jugador y hay ${asociados} partido(s) asociado(s).`
        );
      }
      // Si no hay partidos asociados, borrar el equipo y terminar
      await this.equiposRepo.delete(equipoId);
      return;
    }
    // Si quedan jugadores, reasignar el creador/capitán
    const nuevoCapitan = restantes[Math.floor(Math.random() * restantes.length)];
    await this.equiposRepo.update(equipoId, { creadorId: nuevoCapitan.id });
  }

  async listarEquipos(): Promise<{ id: number; nombre: string; jugadoresCount: number }[]> {
    const equipos = await this.equiposRepo.find({ relations: ['jugadores'] });
    return equipos.map((e) => ({
      id: e.id,
      nombre: e.nombre,
      jugadoresCount: e.jugadores.length,
    }));
  }

  async unirseEquipo(sessionUsuarioId: number, equipoId: number, clave: string): Promise<Equipo> {
    const usuario = await this.usuariosService.findByIdWithJugador(sessionUsuarioId)
    const jugadorId = usuario?.jugador?.id
    if (!jugadorId) throw new UnauthorizedException('Perfil de jugador incompleto')

    const equipo = await this.equiposRepo.findOne({ where: { id: equipoId } })
    if (!equipo) throw new NotFoundException('Equipo no encontrado')
    if (equipo.claveAcceso !== clave) throw new BadRequestException('Clave incorrecta')

    await this.equiposRepo
        .createQueryBuilder()
        .relation(Equipo, 'jugadores')
        .of(equipoId)
        .add(jugadorId)
    return equipo
  }

  async updateEquipo(id: number, dto: UpdateEquipoDto): Promise<Equipo> {
    const equipo = await this.equiposRepo.findOne({ where: { id } })
    if (!equipo) throw new NotFoundException('Equipo no encontrado')
    Object.assign(equipo, dto)
    return this.equiposRepo.save(equipo)
  }

  async findAll(): Promise<Equipo[]> {
    return this.equiposRepo.find({ relations: ['creador', 'creador.usuario'] })
  }

  async remove(id: number): Promise<void> {
    const asociados = await this.partidosRepo.count({
        where: [
            { equipoLocalId: id },
            { equipoVisitanteId: id }
        ]
    })
    if (asociados > 0) {
        throw new BadRequestException(`No puedes eliminar este equipo porque tiene ${asociados} partido(s) asociado(s).`)
    }
    const result = await this.equiposRepo.delete(id)
    if (result.affected === 0) {
        throw new NotFoundException(`Equipo ${id} no encontrado`)
    }
  }

  async estadisticas(teamId: number): Promise<{
      jugados: number
      ganados: number
      perdidos: number
      golesTotales: number
  }> {
      const partidos = await this.partidosRepo.find({
          where: [
              { equipoLocalId: teamId, estado: EstadoPartido.TERMINADO },
              { equipoVisitanteId: teamId, estado: EstadoPartido.TERMINADO }
          ],
          relations: ['goles']
      })
      let ganados = 0, perdidos = 0, golesTotales = 0
      for (const p of partidos) {
          const golesLocal = p.goles.filter(g => g.equipo === 'local')
          const golesVisit = p.goles.filter(g => g.equipo === 'visitante')
          const miEsLocal = p.equipoLocalId === teamId
          const misGolesCount = miEsLocal ? golesLocal.length : golesVisit.length
          const susGolesCount = miEsLocal ? golesVisit.length : golesLocal.length

          if (misGolesCount > susGolesCount) ganados++
          else if (misGolesCount < susGolesCount) perdidos++
          const misGoles = miEsLocal ? golesLocal : golesVisit
          golesTotales += misGolesCount
      }
      return {
          jugados: partidos.length,
          ganados,
          perdidos,
          golesTotales
      }
  }
}