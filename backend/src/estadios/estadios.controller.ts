import { Controller, Get } from "@nestjs/common";
import { EstadiosService } from "./estadios.service";
import { Estadio } from "./estadio.entity";

@Controller('estadios')
export class EstadiosController {
    constructor(private readonly estadiosService: EstadiosService) { }

    @Get()
    findAll(): Promise<Estadio[]> {
        return this.estadiosService.findAll()
    }
}