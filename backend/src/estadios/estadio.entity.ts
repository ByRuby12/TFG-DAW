import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity('estadio')
export class Estadio {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    direccion: string

    @Column('double')
    latitud: number

    @Column('double')
    longitud: number
}