<template>
  <div>
    <div>
      <PanelMenu
        v-if="estadoActual !== 'login' && estadoActual !== 'register' && estadoActual !== 'confirmacion' && estadoActual !== 'recuperar' && estadoActual !== 'codigo' && estadoActual !== 'nueva'"
        :aviso-perfil="!perfilCompleto" :has-equipo="hasEquipo" :is-captain="isCaptain" :username="username"
        :is-admin="userRole === 'administrador'" :is-arbitro="userRole === 'arbitro'" :user-avatar="avatarUrl"
        @cerrar-sesion="handleLogout" @ver-perfil="estadoActual = 'perfil'" @crear-equipo="abrirCrearEquipo"
        @ver-mi-equipo="verMiEquipo" @unirse-equipo="estadoActual = 'inscribirse'" @ver-partidos="onVerPartidos"
        @panel-arbitro="estadoActual = 'panelArbitro'" @ver-inicio="estadoActual = 'home'"
        @ver-ajustes="estadoActual = 'ajustes'" @ver-estadisticas="estadoActual = 'estadisticas'"
        @ver-admin="estadoActual = 'admin'" @avatar-changed="onAvatarChanged" @ver-reportes="onVerReportes"
        @ver-reportes-admin="estadoActual = 'reportesAdmin'" @ver-estadios="estadoActual = 'estadioMapa'">
        <Home v-if="estadoActual === 'home'" />
        <PanelPerfil v-if="estadoActual === 'perfil'" @volver-menu="estadoActual = 'home'"
          @perfil-guardado="onPerfilGuardado" />
        <PanelCrearEquipo v-if="estadoActual === 'crearEquipo'" @equipo-creado="onEquipoCreado"
          @volver-menu="estadoActual = 'home'" />
        <PanelVerEquipo v-if="estadoActual === 'verEquipo'" :equipo-id="miEquipoId" @volver-menu="estadoActual = 'home'"
          @salio-equipo="onEquipoSalio" />
        <PanelInscribirse v-if="estadoActual === 'inscribirse'" @equipo-unido="onEquipoUnido"
          @volver-menu="estadoActual = 'home'" />
        <PanelPartidos v-if="estadoActual === 'partidos'" :equipo-id="miEquipoId"
          @volver-menu="estadoActual = 'home'" />
        <PanelArbitro v-if="estadoActual === 'panelArbitro'" @cancelar="estadoActual = 'home'" />
        <PanelAdmin v-if="estadoActual === 'admin'" />
        <PanelEstadisticas v-if="estadoActual === 'estadisticas'" />
        <PanelAjustes v-if="estadoActual === 'ajustes'" />
        <PanelReportesUsuario v-if="estadoActual === 'reportes'" />
        <PanelReportesAdmin v-if="estadoActual === 'reportesAdmin'" />
        <PanelEstadios v-if="estadoActual === 'estadioMapa'" />
      </PanelMenu>
      <PanelRegister v-if="estadoActual === 'register'" @cambiar-panel="estadoActual = 'login'" />
      <PanelLogin v-if="estadoActual === 'login'" @cambiar-panel="estadoActual = 'register'" @loguear="comprobarLogin"
        @mostrar-recuperacion="estadoActual = 'recuperar'" />
      <PanelConfirmacion v-if="estadoActual === 'confirmacion'" @volver-login="volverAlLogin" />
      <PanelRecuperar v-if="estadoActual === 'recuperar'" @codigo-enviado="mostrarCodigo"
        @volver-login="estadoActual = 'login'" />
      <PanelCodigo v-if="estadoActual === 'codigo'" :correo="correo" @codigo-verificado="mostrarNueva" />
      <PanelNuevaContrasena v-if="estadoActual === 'nueva'" :correo="correo" @volver-login="estadoActual = 'login'" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import axios from 'axios'

import PanelAdmin from './views/admin/PanelAdmin.vue'
import PanelArbitro from './views/admin/PanelArbitro.vue'
import PanelReportesAdmin from './views/admin/PanelReportes.vue'

import PanelAjustes from './views/menu/AjustesPerfil.vue'
import PanelCrearEquipo from './views/menu/CrearEquipo.vue'
import PanelPartidos from './views/menu/CrearPartido.vue'
import PanelEstadios from './views/menu/EstadiosFutbol.vue'
import PanelEstadisticas from './views/menu/EstadisticasGlobales.vue'
import Home from './views/menu/Home.vue'
import PanelInscribirse from './views/menu/InscribirseEquipo.vue'
import PanelMenu from './views/menu/Menu.vue'
import PanelVerEquipo from './views/menu/VerMiEquipo.vue'
import PanelReportesUsuario from './views/menu/Reportes.vue'
import PanelPerfil from './views/menu/MiPerfil.vue'

import PanelCodigo from './views/registro/CodeVerification.vue'
import PanelRecuperar from './views/registro/ForgotPassword.vue'
import PanelLogin from './views/registro/Login.vue'
import PanelRegister from './views/registro/Register.vue'
import PanelNuevaContrasena from './views/registro/ResetPassword.vue'
import PanelConfirmacion from './views/registro/VerificationConfirmation.vue'

axios.defaults.withCredentials = true

const estadoActual = ref<'home' | 'login' | 'register' | 'menu' | 'confirmacion' | 'recuperar' | 'codigo' | 'nueva' | 'perfil' | 'crearEquipo' | 'verEquipo' | 'inscribirse' | 'partidos' | 'panelArbitro' | 'estadisticas' | 'admin' | 'ajustes' | 'reportes' | 'reportesAdmin' | 'estadioMapa'>('login')
const correo = ref('')
const perfilCompleto = ref(false)
const hasEquipo = ref(false)
const miEquipoId = ref<number | null>(null)
const isCaptain = ref(false)
const username = ref(localStorage.getItem('nombreusu') || '')
const userRole = ref<'jugador' | 'arbitro' | 'administrador'>('jugador')
const avatarUrl = ref<string>('../src/assets/logo/logo.png')

const comprobarLogin = async (estado: 'ok' | 'no confirmado') => {
  if (estado === 'ok') {
    try {
      const { data } = await axios.get('http://localhost:3000/usuarios/me', { withCredentials: true })
      if (data.success) {
        userRole.value = data.rol
        username.value = data.Nombreusu
      }
    } catch {
      userRole.value = 'jugador'
    }
    estadoActual.value = 'home'
  } else if (estado === 'no confirmado') {
    estadoActual.value = 'confirmacion'
  }
}

const volverAlLogin = () => {
  estadoActual.value = 'login'
}

const mostrarCodigo = (correoRecibido: string) => {
  correo.value = correoRecibido
  estadoActual.value = 'codigo'
}

const mostrarNueva = (correoConfirmado: string) => {
  correo.value = correoConfirmado
  estadoActual.value = 'nueva'
}

const handleLogout = () => {
  localStorage.removeItem('nombreusu')
  estadoActual.value = 'login'
}

const onPerfilGuardado = (completo: boolean) => {
  perfilCompleto.value = completo
  estadoActual.value = 'home'
}

const abrirCrearEquipo = () => {
  estadoActual.value = 'crearEquipo'
}

const onEquipoCreado = (equipo: { id: number }) => {
  hasEquipo.value = true
  miEquipoId.value = equipo.id
  estadoActual.value = 'verEquipo'
}

const verMiEquipo = () => {
  if (miEquipoId.value != null) {
    estadoActual.value = 'verEquipo'
  }
}

const onAvatarChanged = (newUrl: string) => {
  avatarUrl.value = `${newUrl}?t=${Date.now()}`
}

const onVerReportes = () => { estadoActual.value = 'reportes' };

const checkPerfilCompleto = async () => {
  const storedNombre = localStorage.getItem('nombreusu')
  if (!storedNombre) {
    perfilCompleto.value = false
    return
  }
  try {
    const { data } = await axios.get(`http://localhost:3000/usuarios/perfil-completo/${storedNombre}`, { withCredentials: true })
    perfilCompleto.value = data.completo
  } catch {
    perfilCompleto.value = false
  }
}

const checkMiEquipo = async () => {
  try {
    const { data } = await axios.get('http://localhost:3000/equipos/mi-equipo', { withCredentials: true })
    if (data.equipo) {
      hasEquipo.value = true
      miEquipoId.value = data.equipo.id
      isCaptain.value = data.isCaptain
    } else {
      hasEquipo.value = false
      miEquipoId.value = null
      isCaptain.value = false
    }
  } catch {
    hasEquipo.value = false
    miEquipoId.value = null
    isCaptain.value = false
  }
}

const onEquipoSalio = () => {
  hasEquipo.value = false
  miEquipoId.value = null
  estadoActual.value = 'inscribirse'
}

const onEquipoUnido = async (equipo: { id: number }) => {
  hasEquipo.value = true
  miEquipoId.value = equipo.id
  await checkMiEquipo()
  estadoActual.value = 'verEquipo'
}

const onVerPartidos = () => { estadoActual.value = 'partidos' }

watch(estadoActual, async (nuevo) => {
  if (nuevo === 'menu' || nuevo === 'home') {
    await checkPerfilCompleto()
    await checkMiEquipo()
  }
})

onMounted(async () => {
  const urlParams = new URLSearchParams(window.location.search)
  const loginGoogle = urlParams.get('loginGoogle')
  const nombreusu = urlParams.get('nombreusu')
  const google = urlParams.get('google')
  const email = urlParams.get('email')

  if (loginGoogle === 'true' && nombreusu) {
    console.log(`Sesión iniciada con Google como: ${nombreusu}`)
    localStorage.setItem('nombreusu', nombreusu)
    estadoActual.value = 'menu'
    window.history.replaceState({}, document.title, '/')
    return
  } else if (google === 'true' && email) {
    console.log(`Necesitas registrarte con el correo de Google: ${email}`)
    correo.value = email
    estadoActual.value = 'register'
    window.history.replaceState({}, document.title, '/')
    return
  }
  try {
    if (!localStorage.getItem('nombreusu')) {
      estadoActual.value = 'login'
      return
    }
    const { data } = await axios.get('http://localhost:3000/usuarios/me', { withCredentials: true })
    if (data.success) {
      username.value = data.Nombreusu
      userRole.value = data.rol
      const equipoResp = (await axios.get('http://localhost:3000/equipos/mi-equipo', { withCredentials: true })).data
      if (equipoResp.equipo) {
        hasEquipo.value = true
        miEquipoId.value = equipoResp.equipo.id
      } else {
        hasEquipo.value = false
      }
      const { data: fotoAvatar } = await axios.get('http://localhost:3000/usuarios/usuario-actual')
      if (fotoAvatar.foto) {
        avatarUrl.value = `${fotoAvatar.foto}?t=${Date.now()}`
      }
      estadoActual.value = 'home'
      await checkPerfilCompleto()
      await checkMiEquipo()
    } else {
      estadoActual.value = 'login'
    }
  } catch (error: any) {
    hasEquipo.value = false
    estadoActual.value = 'login'
    // Si es un 401, no mostramos nada en consola (flujo esperado)
    if (error?.response?.status !== 401) {
      // Solo mostramos el error si no es 401
      // console.error(error)
    }
    // Evitamos que el error 401 salga en consola
    return
  }
})
</script>

<style scoped></style>