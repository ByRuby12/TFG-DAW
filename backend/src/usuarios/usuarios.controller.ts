import { Controller, Post, Body, Get, Param, Res, Req, UseGuards, InternalServerErrorException, UseInterceptors, UploadedFile, UnauthorizedException, Put, Session, Delete } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { Response, Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { Jugador } from 'src/jugadores/jugador.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer'
import { Persona } from 'src/personas/persona.entity';
import { Gol } from 'src/partidos/gol.entity';
import { Tarjeta } from 'src/partidos/tarjeta.entity';
import { Partido } from 'src/partidos/partido.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EquiposService } from 'src/equipos/equipos.service';
import { Usuario } from './usuario.entity';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

@Controller('usuarios')
export class UsuariosController {
    constructor(
        private readonly usuariosService: UsuariosService,
        private readonly equiposService: EquiposService,
        @InjectRepository(Gol) private golRepo: Repository<Gol>,
        @InjectRepository(Tarjeta) private tarjetaRepo: Repository<Tarjeta>,
        @InjectRepository(Partido) private partidoRepo: Repository<Partido>
    ) { }

    @Post('register')
    async register(@Body() body: { Nombreusu: string; correo: string; contrasena: string }) {
        const nuevoUsuario = await this.usuariosService.register(body)
        return { success: true, usuario: nuevoUsuario }
    }

    @Post('login')
    async login(@Body() body: { Nombreusu: string; contrasena: string }, @Req() req) {
        const user = await this.usuariosService.login(body.Nombreusu, body.contrasena)

        if (!user) {
            return { success: false, message: 'Usuario o contraseña incorrectos' }
        }

        req.session.usuario = null

        req.session.usuario = {
            id: user.id,
            Nombreusu: user.Nombreusu,
            correo: user.correo,
            rol: user.rol
        }

        await new Promise<void>((resolve, reject) => {
            req.session.save(err => {
                if (err) {
                    console.error("Error al guardar la sesión:", err)
                    reject(err)
                } else {
                    resolve()
                }
            })
        })
        return { success: true }
    }

    @Post('enviar-codigo')
    async enviarCodigo(@Body() body: { correo: string }) {
        return this.usuariosService.enviarCodigoRecuperacion(body.correo)
    }

    @Post('verificar-codigo')
    async verificarCodigo(@Body() body: { correo: string, codigo: string }) {
        return this.usuariosService.verificarCodigo(body.correo, body.codigo)
    }

    @Post('cambiar-contrasena')
    async cambiarContrasena(@Body() body: { correo: string, nuevaContrasena: string }) {
        return this.usuariosService.cambiarContrasena(body.correo, body.nuevaContrasena)
    }

    @Post('subir-foto')
    @UseInterceptors(FileInterceptor('foto', {
        storage: diskStorage({
            destination: './uploads/fotos',
            filename: (req, file, cb) => {
                const nombreArchivo = `${Date.now()}-${file.originalname}`
                cb(null, nombreArchivo)
            }
        })
    }))

    uploadFoto(
        @UploadedFile() file: any,
        @Body('nombreusu') nombreusu: string
    ) {
        return this.usuariosService.guardarFoto(nombreusu, file.filename)
    }

    @Post('logout')
    async logout(@Req() req: Request, @Res() res: Response) {
        return new Promise<void>((resolve, reject) => {
            req.session.destroy(err => {
                if (err) {
                    console.error('Error destrucción de sesión:', err)
                    return reject(err)
                }
                res.clearCookie('connect.sid')
                res.json({ success: true })
                resolve()
            })
        })
    }

    @Post(':id/perfil')
    async actualizarPerfilCompleto(
        @Param('id') id: number,
        @Body() payload: { persona: Partial<Persona>; jugador: Partial<Jugador> }
    ) {
        const result = await this.usuariosService.guardarPerfilCompleto(
            id,
            payload.persona,
            payload.jugador
        )
        return { success: true, persona: result.persona, jugador: result.jugador }
    }

    @Get('confirmar/:nombreusu')
    async confirmarCuenta(@Param('nombreusu') nombreusu: string, @Res() res: Response) {
        const user = await this.usuariosService.confirmarUsuario(nombreusu)
        if (user) {
            return res.redirect('http://localhost:5173/confirmacion-exitosa')
        }
        return res.redirect('http://localhost:5173/confirmacion-fallida')
    }

    @Get('existe-nombre/:nombre')
    async existeNombre(@Param('nombre') nombre: string) {
        const usuario = await this.usuariosService.findByNombreusu(nombre)
        return { existe: !!usuario }
    }

    @Get('existe-correo/:correo')
    async existeCorreo(@Param('correo') correo: string) {
        const usuario = await this.usuariosService.findByCorreo(correo)
        return { existe: !!usuario }
    }

    @Get('google')
    @UseGuards(AuthGuard('google'))
    async googleAuth() {

    }

    @Get('google/redirect')
    @UseGuards(AuthGuard('google'))
    async googleRedirect(@Req() req: Request, @Res() res: Response) {
        const user = req.user as any

        req.session.usuario = undefined

        req.session.usuario = {
            id: user.id,
            Nombreusu: user.Nombre_usu,
            correo: user.correo,
            rol: user.rol
        }

        await new Promise<void>((resolve, reject) => {
            req.session.save(err => {
                if (err) {
                    console.error('Error al guardar sesión con google:', err)
                    reject(err)
                } else {
                    resolve()
                }
            })
        })
        return res.redirect(`http://localhost:5173/login-exitoso?nombreusu=${user.Nombreusu}`)
    }

    @Get('perfil-completo/:nombreusu')
    async perfilCompleto(@Param('nombreusu') nombreusu: string) {
        const completo = await this.usuariosService.perfilCompleto(nombreusu)

        return { completo }
    }

    @Get(':nombreusu/jugador')
    async obtenerPerfilJugador(@Param('nombreusu') nombreusu: string) {
        return this.usuariosService.obtenerPerfil(nombreusu)
    }

    @Get('usuario-actual')
    async getUsuarioActual(@Req() req) {
        if (!req.session || !req.session.usuario) {
            console.log('No hay sesión de usuario');
            return { success: false, message: 'No autenticado' }
        }

        try {
            console.log("Usuario en sesión:", req.session.usuario)
            const usuario = await this.usuariosService.findUserWithJugador(req.session.usuario.id)
            if (!usuario) {
                return { success: false, message: 'Usuario no encontrado' }
            }
            const username = usuario.Nombreusu
            const goles = await this.golRepo.count({ where: { jugador: username } });
            const asistencias = await this.golRepo.count({ where: { asistidoPor: username } });
            const tarjetasRojas = await this.tarjetaRepo.count({ where: { jugador: username, tipo: 'roja' } });
            const tarjetasAmarillas = await this.tarjetaRepo.count({ where: { jugador: username, tipo: 'amarilla' } });

            const jugadorId = usuario.jugador?.id;
            // 2) Busco su equipo
            const equipo = await this.equiposService.findMiEquipo(jugadorId);
            const teamId = equipo?.id;

            // 3) Ahora cuento los partidos por teamId, no por idUsuario
            const partidosJugados = teamId
                ? await this.partidoRepo.count({
                    where: [
                        { equipoLocalId: teamId },
                        { equipoVisitanteId: teamId }
                    ]
                })
                : 0;

            return {
                success: true,
                id: usuario.id,
                Nombreusu: usuario.Nombreusu,
                correo: usuario.correo,
                foto: usuario.foto,
                rol: usuario.rol,
                persona: usuario.persona,
                jugador: usuario.jugador,
                stats: { goles, asistencias, tarjetasRojas, tarjetasAmarillas, partidosJugados }
            }
        } catch (error) {
            console.error('Error al obtener datos del usuario:', error)
            throw new InternalServerErrorException('Error al obtener datos')
        }
    }

    @Get('me')
    async me(@Req() req: Request) {
        const u = req.session.usuario
        if (!u) throw new UnauthorizedException()
        const usuario = await this.usuariosService.findByIdWithJugador(u.id)
        return {
            success: true,
            id: usuario?.id,
            Nombreusu: usuario?.Nombreusu,
            rol: usuario?.rol,
            correo: usuario?.correo,
            foto: usuario?.foto
        }
    }

    @Get('arbitros-usuarios')
    async listarArbitrosUsuarios(): Promise<Usuario[]> {
        return this.usuariosService.findAllArbitros()
    }

    @Get()
    async findAll(): Promise<Usuario[]> {
        return this.usuariosService.findAll()
    }

    @Put(':id')
    async updateUsuario(
        @Param('id') id: number,
        @Body() dto: UpdateUsuarioDto,
    ) {
        return this.usuariosService.updateUsuario(id, dto)
    }

    @Put(':id/foto')
    async updateFoto(
        @Param('id') id: number,
        @Body('foto') foto: string
    ) {
        return this.usuariosService.updateUsuario(id, { foto });
    }

    @Delete(':id')
    async removeUsuario(
        @Param('id') id: number,
        @Req() req: Request
    ) {
        await this.usuariosService.remove(id)
        return { success: true }
    }
}
