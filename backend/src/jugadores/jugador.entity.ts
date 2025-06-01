import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany, ManyToMany } from "typeorm";
import { Usuario } from "src/usuarios/usuario.entity";
import { Equipo } from "src/equipos/equipo.entity";


@Entity('jugadores')
export class Jugador {
    @PrimaryGeneratedColumn({ name: 'id_jugador' })
    id: number

    @Column({ type: 'int', name: 'num_camiseta' })
    numCamiseta: number

    @Column({ type: 'enum', enum: ['diestro', 'zurdo', 'ambidiestro'], name: 'pierna_buena' })
    piernaBuena: 'diestro' | 'zurdo' | 'ambidiestro'

    @Column({ name: 'id_usuario' })
    idUsuario: number

    @OneToOne(() => Usuario, usuario => usuario.jugador)
    @JoinColumn({ name: 'id_usuario' })
    usuario: Usuario

    @OneToMany(() => Equipo, equipo => equipo.creador)
    equipos: Equipo[]

    @ManyToMany(() => Equipo, equipo => equipo.jugadores)
    equiposJugadores: Equipo[]

    @Column({ type: 'enum', enum: ['portero', 'defensa', 'centrocampista', 'delantero'], nullable: true, default: null })
    posicion: 'portero' | 'defensa' | 'centrocampista' | 'delantero' | null
}