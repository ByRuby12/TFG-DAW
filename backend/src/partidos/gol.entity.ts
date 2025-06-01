import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Partido } from "./partido.entity";

@Entity('goles')
export class Gol {
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(() => Partido, p => p.goles, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'partidoId' })
    partido: Partido

    @Column()
    partidoId: number

    @Column()
    equipo: string

    @Column()
    jugador: string

    @Column({ nullable: true })
    asistidoPor: string

    @Column({ type: 'enum', enum: ['normal', 'penalti', 'falta', 'corner'], default: 'normal' })
    tipo: 'normal' | 'penalti' | 'falta' | 'corner'

    @Column()
    minuto: string
}