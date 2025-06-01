import { Controller, Get } from "@nestjs/common";
import { ArbitrosService } from "./arbitros.service";

@Controller('arbitros')
export class ArbitrosController {
    constructor(private arbitrosService: ArbitrosService) { }

    @Get()
    findAll() {
        return this.arbitrosService.findAll()
    }
}