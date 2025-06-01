import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator"
import { EstadoPartido } from "../partido.entity"

export class CreatePartidoDto {
    @IsNumber() equipoLocalId: number
    @IsNumber() equipoVisitanteId: number
    @IsEnum(EstadoPartido)
    @IsOptional() estado?: EstadoPartido
    @IsString() @IsOptional() descripcion?: string
    @IsString() @IsNotEmpty() fechaInicio: string
    @IsString() @IsNotEmpty() estadio: string
    @IsNumber() @IsOptional() arbitroId?: number
}