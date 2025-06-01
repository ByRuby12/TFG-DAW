import { Controller, Get } from "@nestjs/common";
import { JugadoresService } from "./jugadores.service";
import { Jugador } from "./jugador.entity";

@Controller('jugadores')
export class JugadoresController {
    constructor(private readonly jugadoresService: JugadoresService) { }

    @Get('estadisticas')
    async estadisticas(): Promise<Partial<Jugador>[]> {
        return this.jugadoresService.findAllWithStats()
    }
}