import { Gol } from "../gol.entity";
import { Tarjeta } from "../tarjeta.entity";

export class GuardarResultadosDto {
    partidoId: number
    goles: Gol[]
    tarjetas: Tarjeta[]
}