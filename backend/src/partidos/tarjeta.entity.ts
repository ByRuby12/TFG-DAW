import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Partido } from "./partido.entity";

@Entity('tarjetas')
export class Tarjeta {
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(() => Partido, p => p.tarjetas, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'partidoId' })
    partido: Partido

    @Column()
    partidoId: number

    @Column()
    equipo: string

    @Column()
    jugador: string

    @Column({ type: 'enum', enum: ['amarilla', 'roja'], default: 'amarilla' })
    tipo: 'amarilla' | 'roja'

    @Column()
    minuto: string
}