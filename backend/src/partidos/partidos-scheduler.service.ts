import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { Repository, MoreThan } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Partido, EstadoPartido } from "./partido.entity";

@Injectable()
export class PartidosSchedulerService {
    private readonly logger = new Logger(PartidosSchedulerService.name)
    constructor(
        @InjectRepository(Partido)
        private readonly repo: Repository<Partido>,
    ) { }

    @Cron(CronExpression.EVERY_MINUTE)
    async handleStatusTransitions() {
        const now = new Date()
        const res1 = await this.repo
            .createQueryBuilder()
            .update(Partido)
            .set({ estado: EstadoPartido.ACTIVO })
            .where('estado = :pendiente AND fechaInicio <= :now', {
                pendiente: EstadoPartido.PENDIENTE,
                now,
            })
            .execute()
        if (res1.affected) this.logger.log(`Activados ${res1.affected} partidos`)
        const cutoffActive = new Date(now.getTime() - 1.5 * 60 * 60 * 1000)
        const res2 = await this.repo
            .createQueryBuilder()
            .update(Partido)
            .set({ estado: EstadoPartido.TERMINADO })
            .where('estado = :activo AND fechaInicio <= :cutoff', {
                activo: EstadoPartido.ACTIVO,
                cutoff: cutoffActive
            })
            .execute()
        if (res2.affected) this.logger.log(`Terminados ${res2.affected} partidos`)

        const cutoffDelete = new Date(now.getTime() - (1.5 + 24) * 60 * 60 * 1000)
        const old = await this.repo.find({
            where: {
                estado: EstadoPartido.TERMINADO,
                fechaInicio: MoreThan(new Date(0)),
            },
        })
        const toDelete = old.filter(p => p.fechaInicio <= cutoffDelete)
        if (toDelete.length) {
            const ids = toDelete.map(p => p.id)
            await this.repo.delete(ids)
            this.logger.log(`Eliminados ${ids.length} partidos antiguos`)
        }
    }
}