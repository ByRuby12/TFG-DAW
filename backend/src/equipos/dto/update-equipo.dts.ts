import { IsString, IsNotEmpty, IsOptional, IsHexColor } from "class-validator";

export class UpdateEquipoDto {
    @IsOptional() @IsString() @IsNotEmpty() nombre?: string
    @IsOptional() @IsString() @IsNotEmpty() siglas?: string
    @IsOptional() @IsString() @IsNotEmpty() lema?: string
    @IsOptional() @IsHexColor() color?: string
    @IsOptional() @IsString() @IsNotEmpty() estadio?: string
}