import { Injectable, OnModuleInit } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Arbitro } from "./arbitro.entity";

@Injectable()
export class ArbitrosService implements OnModuleInit {
    constructor(
        @InjectRepository(Arbitro)
        private repo: Repository<Arbitro>
    ) { }

    async onModuleInit() {
        const count = await this.repo.count()

        if (count === 0) {
            await this.repo.save([{ nombre: 'Árbitro A' }, { nombre: 'Árbitro B' }])
        }
    }

    findAll() {
        return this.repo.find()
    }
}