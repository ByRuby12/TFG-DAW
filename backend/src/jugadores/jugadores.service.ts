import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { Jugador } from "./jugador.entity";
import { Gol } from "src/partidos/gol.entity";
import { Tarjeta } from "src/partidos/tarjeta.entity";

@Injectable()
export class JugadoresService {
    constructor(
        @InjectRepository(Jugador)
        private readonly repo: Repository<Jugador>,
        private readonly dataSource: DataSource
    ) { }

    async findAllWithStats(): Promise<any[]> {
        const jugadores = await this.repo.find({
            relations: [
                'usuario',
                'usuario.persona',
                'equipos'     // nombre exacto de la propiedad en Jugador
            ]
        })

        const golRepo = this.dataSource.getRepository(Gol)
        const tarjetaRepo = this.dataSource.getRepository(Tarjeta)

        return Promise.all(jugadores.map(async j => {
            const username = j.usuario.Nombreusu
            const goles = await golRepo.count({ where: { jugador: username } })
            const tarjetasAmarillas = await tarjetaRepo.count({ where: { jugador: username, tipo: 'amarilla' } })
            const tarjetasRojas = await tarjetaRepo.count({ where: { jugador: username, tipo: 'roja' } })
            const golesPorPartido = await golRepo
                .createQueryBuilder("g")
                .select("g.partidoId", "pid")
                .where("g.jugador = :username", { username })
                .getRawMany<{ pid: number }>();
            const tarjetasPorPartido = await tarjetaRepo
                .createQueryBuilder("t")
                .select("t.partidoId", "pid")
                .where("t.jugador = :username", { username })
                .getRawMany<{ pid: number }>();

            const partidosSet = new Set<number>();
            golesPorPartido.forEach((r) => partidosSet.add(r.pid));
            tarjetasPorPartido.forEach((r) =>
                partidosSet.add(r.pid)
            );
            const equipoNombre = j.equipos.length
                ? j.equipos[0].nombre
                : 'Sin equipo';
            golesPorPartido.forEach(r => partidosSet.add(r.pid))
            tarjetasPorPartido.forEach(r => partidosSet.add(r.pid))
            const partidosJugados = partidosSet.size

            return {
                id: j.id,
                fotoPerfil: j.usuario.foto,
                usuario: j.usuario.Nombreusu,
                correo: j.usuario.correo,
                city: j.usuario.persona?.municipio ?? '',
                postalCode: j.usuario.persona?.codigoPostal ?? '',
                position: j.posicion,
                equipo: equipoNombre,
                rol: j.usuario.rol,
                piernaBuena: j.piernaBuena ?? 'Desconocida',
                goles,
                tarjetasAmarillas,
                tarjetasRojas,
                partidosJugados
            }
        }))
    }
}