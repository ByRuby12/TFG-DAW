import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Estadio } from "./estadio.entity";

@Injectable()
export class EstadiosService {
    constructor(
        @InjectRepository(Estadio)
        private readonly repo: Repository<Estadio>
    ) { }

    findAll(): Promise<Estadio[]> {
        return this.repo.find()
    }
}