import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { Equipo } from "src/equipos/equipo.entity";
import { Arbitro } from "src/arbitros/arbitro.entity";
import { Gol } from "./gol.entity";
import { Tarjeta } from "./tarjeta.entity";
import { Usuario } from "src/usuarios/usuario.entity";

export enum EstadoPartido {
    PENDIENTE = 'Pendiente',
    ACTIVO = 'Activo',
    ASIGNADO = 'Asignado',
    RECHAZADO = 'Rechazado',
    TERMINADO = 'Terminado'
}

@Entity('partidos')
export class Partido {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    equipoLocalId: number

    @ManyToOne(() => Equipo, { eager: true })
    @JoinColumn({ name: 'equipoLocalId' })
    equipoLocal: Equipo

    @Column()
    equipoVisitanteId: number

    @ManyToOne(() => Equipo, { eager: true })
    @JoinColumn({ name: 'equipoVisitanteId' })
    equipoVisitante: Equipo

    @Column({ type: 'enum', enum: EstadoPartido, default: EstadoPartido.PENDIENTE })
    estado: EstadoPartido

    @Column({ type: 'text', nullable: true })
    descripcion: string

    @Column({ type: 'datetime' })
    fechaInicio: Date

    @Column()
    estadio: string

    @Column()
    creadorId: number

    @Column({ nullable: true })
    arbitroId: number

    @ManyToOne(() => Usuario, { eager: true, nullable: true })
    @JoinColumn({ name: 'arbitroId' })
    arbitro: Usuario

    @OneToMany(() => Gol, gol => gol.partido, { cascade: true })
    goles: Gol[]

    @OneToMany(() => Tarjeta, t => t.partido, { cascade: true })
    tarjetas: Tarjeta[]
}