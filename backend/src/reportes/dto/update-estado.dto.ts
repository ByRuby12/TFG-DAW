import { IsEnum } from "class-validator";

export class UpdateEstadoDto {
    @IsEnum(['Pendiente', 'Completado', 'Rechazado'])
    estado: 'Pendiente' | 'Completado' | 'Rechazado'
}