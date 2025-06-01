import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, ManyToMany, JoinTable } from "typeorm";
import { Jugador } from "src/jugadores/jugador.entity";

@Entity('equipos')
export class Equipo {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    nombre: string

    @Column({ length: 3 })
    siglas: string

    @Column()
    lema: string

    @Column()
    color: string

    @Column()
    claveAcceso: string

    @Column()
    estadio: string

    @Column({ type: 'date', default: () => 'CURRENT_DATE' })
    fechaFundacion: string

    @Column()
    creadorId: number

    @ManyToOne(() => Jugador, jugador => jugador.equipos, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'creadorId' })
    creador: Jugador

    @ManyToMany(() => Jugador, jugador => jugador.equipos)
    @JoinTable({
        name: 'equipo_jugadores',
        joinColumn: { name: 'equipoId' },
        inverseJoinColumn: { name: 'jugadorId' }
    })
    jugadores: Jugador[]
}