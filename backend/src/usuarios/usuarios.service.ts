import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RolUsuario, Usuario } from './usuario.entity';
import * as bcrypt from 'bcrypt'
import { CorreoService } from './correo.service';
import { Jugador } from 'src/jugadores/jugador.entity';
import { Persona } from 'src/personas/persona.entity';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { Equipo } from 'src/equipos/equipo.entity';


@Injectable()
export class UsuariosService {
    constructor(
        @InjectRepository(Usuario)
        private usuariosRepo: Repository<Usuario>,
        @InjectRepository(Jugador)
        private jugadoresRepo: Repository<Jugador>,
        @InjectRepository(Persona)
        private personasRepo: Repository<Persona>,
        private correoService: CorreoService,
        @InjectRepository(Equipo)
        private equiposRepo: Repository<Equipo>
    ) { }

    async register(usuario: Partial<Usuario>): Promise<Usuario> {
        const { Nombreusu, correo, contrasena } = usuario

        const existente = await this.usuariosRepo.findOne({
            where: [
                { Nombreusu },
                { correo }
            ]
        })

        if (existente) {
            throw new Error('El nombre o correo ya está en uso.')
        }

        const saltos = 10
        const hashedContrasena = await bcrypt.hash(usuario.contrasena, saltos)

        const nuevoUsuario = this.usuariosRepo.create({
            ...usuario,
            contrasena: hashedContrasena,
        })
        const usuarioGuardado = await this.usuariosRepo.save(nuevoUsuario)
        await this.correoService.enviarConfirmacion(usuarioGuardado.correo, usuarioGuardado.Nombreusu)
        return usuarioGuardado
    }

    async login(Nombreusu: string, contrasena: string) {
        const user = await this.usuariosRepo.findOne({
            where: { Nombreusu }
        })
        if (!user) return null
        if (!user.confirmado) return null
        const esCorrecto = await bcrypt.compare(contrasena, user.contrasena)
        if (!esCorrecto) return null
        return user
    }

    async confirmarUsuario(nombreusu: string): Promise<Usuario | null> {
        const user = await this.usuariosRepo.findOne({ where: { Nombreusu: nombreusu } })
        if (!user) return null
        user.confirmado = true
        return this.usuariosRepo.save(user)
    }

    async findByNombreusu(nombre: string): Promise<Usuario | null> {
        return this.usuariosRepo.findOne({
            where: { Nombreusu: nombre },
            relations: ['jugador', 'persona']
        })
    }

    async findByCorreo(correo: string): Promise<Usuario | null> {
        return this.usuariosRepo.findOne({ where: { correo } })
    }

    async enviarCodigoRecuperacion(correo: string) {
        const user = await this.usuariosRepo.findOne({ where: { correo } })
        if (!user) throw new Error('Usuario no encontrado')

        const codigo = Math.floor(100000 + Math.random() * 900000).toString()
        user.codigoRecuperacion = codigo
        user.codigoExpiracion = Date.now() + 10 * 60 * 1000 // 10 min
        await this.usuariosRepo.save(user)

        await this.correoService.enviarCodigo(correo, codigo)
    }

    async verificarCodigo(correo: string, codigo: string) {
        const user = await this.usuariosRepo.findOne({ where: { correo } })
        if (!user || user.codigoRecuperacion !== codigo || Date.now() > Number(user.codigoExpiracion)) {
            throw new Error('Código inválido o expirado')
        }
    }

    async cambiarContrasena(correo: string, nuevaContra: string) {
        const user = await this.usuariosRepo.findOne({ where: { correo } })
        if (!user) throw new Error('Usuario no encontrado')

        const hashed = await bcrypt.hash(nuevaContra, 10)
        user.contrasena = hashed
        user.codigoRecuperacion = null
        user.codigoExpiracion = null
        await this.usuariosRepo.save(user)
    }

    async crearDesdeGoogle(data: Partial<Usuario>): Promise<Usuario> {
        const { correo, Nombreusu } = data
        const existente = await this.usuariosRepo.findOne({
            where: [{ correo }, { Nombreusu }]
        })

        if (existente) {
            return existente
        }

        const contrasena = 'google_user_password'
        const saltos = 10
        const hashedContrasena = await bcrypt.hash(contrasena, saltos)
        const nuevoUsuario = this.usuariosRepo.create({
            ...data,
            contrasena: hashedContrasena,
            confirmado: true
        })
        const usuarioGuardado = await this.usuariosRepo.save(nuevoUsuario)
        return usuarioGuardado
    }

    async perfilCompleto(nombreusu: string): Promise<boolean> {
        const usuario = await this.usuariosRepo.findOne({
            where: { Nombreusu: nombreusu },
            relations: ['persona', 'jugador']
        })
        if (!usuario) return false
        const p = usuario.persona
        const j = usuario.jugador
        const personaCompleta = !!(
            p &&
            p.nombre.trim() &&
            p.primer_apellido.trim() &&
            p.fechaNac &&
            p.sexo &&
            p.peso != null &&
            p.altura != null &&
            p.municipio.trim() &&
            p.direccion.trim() &&
            p.biografia.trim()
        )
        const jugadorCompleto = !!(
            j &&
            j.numCamiseta != null &&
            j.piernaBuena
        )
        return personaCompleta && jugadorCompleto
    }

    async findUserWithJugador(id: number): Promise<Usuario | null> {
        return this.usuariosRepo.findOne({
            where: { id },
            relations: ['jugador', 'persona']
        })
    }

    async guardarPerfilCompleto(idUsuario: number, personaData: Partial<Persona>, jugadorData: Partial<Jugador>): Promise<{ persona: Persona; jugador: Jugador }> {
        const usuario = await this.usuariosRepo.findOne({
            where: { id: idUsuario },
            relations: ['persona', 'jugador']
        })

        if (!usuario) {
            throw new Error('Usuario no encontrado')
        }

        let persona = usuario.persona
        if (persona) {
            Object.assign(usuario.persona, personaData)
            persona = await this.personasRepo.save(persona)
        } else {
            persona = this.personasRepo.create({ ...personaData, usuario })
            persona = await this.personasRepo.save(persona)
        }
        let jugador = usuario.jugador
        if (jugador) {
            Object.assign(jugador, jugadorData)
            jugador = await this.jugadoresRepo.save(jugador)
        } else {
            jugador = this.jugadoresRepo.create({ ...jugadorData, usuario })
            jugador = await this.jugadoresRepo.save(jugador)
        }
        return { persona, jugador }
    }

    async obtenerPerfil(nombreusu: string): Promise<{ persona: Persona; jugador: Jugador } | null> {
        const usuario = await this.usuariosRepo.findOne({
            where: { Nombreusu: nombreusu },
            relations: ['persona', 'jugador']
        })

        if (!usuario) return null

        return {
            persona: usuario.persona,
            jugador: usuario.jugador
        }
    }

    async guardarFoto(nombreusu: string, nombreArchivo: string) {
        const user = await this.usuariosRepo.findOne({ where: { Nombreusu: nombreusu } })
        if (!user) throw new Error('Usuario no encontrado')
        user.foto = `http://localhost:3000/uploads/fotos/${nombreArchivo}`
        await this.usuariosRepo.save(user)
        return { success: true, urlFoto: user.foto }
    }

    async findByIdWithJugador(id: number) {
        return this.usuariosRepo.findOne({
            where: { id },
            relations: ['jugador']
        })
    }

    async updateRol(userId: number, rol: RolUsuario): Promise<Usuario> {
        const u = await this.usuariosRepo.findOne({ where: { id: userId } });
        if (!u) {
            throw new NotFoundException(`Usuario con id ${userId} no encontrado`);
        }
        u.rol = rol;
        return this.usuariosRepo.save(u);
    }

    async updatePersona(userId: number, personaData: Partial<Persona>): Promise<Persona> {
        // 1) Busca el usuario con su persona
        const u = await this.usuariosRepo.findOne({
            where: { id: userId },
            relations: ['persona'],
        });

        // 2) Si no existe, lanzamos excepción
        if (!u) {
            throw new NotFoundException(`Usuario ${userId} no encontrado`);
        }

        let persona: Persona;

        if (u.persona) {
            // 3a) Si ya había persona, se actualiza inplace y se guarda
            Object.assign(u.persona, personaData);
            persona = await this.personasRepo.save(u.persona);
        } else {
            // 3b) Si no tenía, creamos nueva vinculándola al usuario
            //    y le decimos a TS que 'u' no es null con 'u!'
            persona = this.personasRepo.create({
                ...personaData,
                usuario: u!,
            });
            persona = await this.personasRepo.save(persona);
        }

        return persona;
    }

    async findAllArbitros(): Promise<Usuario[]> {
        return this.usuariosRepo.find({
            where: { rol: RolUsuario.ARBITRO },
            relations: ['persona']
        })
    }

    async findAll(): Promise<Usuario[]> {
        return this.usuariosRepo.find({ relations: ['persona', 'jugador'] })
    }

    async updateUsuario(id: number, dto: UpdateUsuarioDto): Promise<Usuario> {
        const u = await this.usuariosRepo.findOne({ where: { id } })
        if (!u) throw new NotFoundException(`Usuario ${id} no encontrado`)
        Object.assign(u, dto)
        return this.usuariosRepo.save(u)
    }

    async remove(id: number): Promise<void> {
        const usuario = await this.usuariosRepo.findOne({
            where: { id },
            relations: ['jugador']
        })
        if (!usuario) throw new NotFoundException(`Usuario ${id} no encontrado`)
        if (!usuario.jugador) {
            await this.usuariosRepo.delete(id)
            return
        }
        const jugadorId = usuario.jugador.id
        const equiposAsociados = await this.equiposRepo
            .createQueryBuilder('e')
            .innerJoin('e.jugadores', 'j', 'j.id = :jugadorId', { jugadorId })
            .getCount()
        if (equiposAsociados > 0) {
            throw new BadRequestException(`No puedes eliminar este usuario porque está en ${equiposAsociados} equipo(s).`)
        }
        await this.jugadoresRepo.delete(jugadorId)
        await this.usuariosRepo.delete(id)
    }
}