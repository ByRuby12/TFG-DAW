<template>
  <!-- Sección de perfil -->
  <div class="bg-white shadow-lg rounded-2xl overflow-hidden mb-10">
    <div class="flex flex-col md:flex-row items-center p-6 md:p-8 gap-6">
      <!-- Foto -->
      <div class="relative w-32 h-32">
        <img :src="fotoPerfil" alt="Foto de perfil" class="w-32 h-32 rounded-full object-cover ring-4 ring-indigo-300" />
      </div>
      <!-- Info básica -->
      <div class="text-center md:text-left space-y-1">
        <h2 class="text-2xl font-bold text-gray-800">{{ datosPersona.nombre }} {{ datosPersona.primer_apellido }} {{ datosPersona.segundo_apellido }}</h2>
        <p class="text-gray-600"><strong>Correo:</strong> {{ datosUsuario.correo }}</p>
        <p class="text-gray-600"><strong>Fecha de nacimiento:</strong> {{ datosPersona.fechaNac }}</p>
        <p class="text-gray-600"><strong>Municipio:</strong> {{ datosPersona.municipio }}</p>
      </div>
    </div>
  </div>

  <!-- Datos personales y deportivos -->
  <div class="grid md:grid-cols-2 gap-6 mb-10">
    <!-- Información personal -->
    <div class="bg-white shadow-md rounded-2xl p-6">
      <h3 class="text-xl font-semibold text-indigo-600 mb-4">Información personal</h3>
      <ul class="space-y-2 text-gray-700">
        <li><strong>Sexo:</strong> {{ datosPersona.sexo }}</li>
        <li><strong>Peso:</strong> {{ datosPersona.peso || '-' }} kg</li>
        <li><strong>Altura:</strong> {{ datosPersona.altura || '-' }} cm</li>
        <li><strong>Dirección:</strong> {{ datosPersona.direccion || '-' }}</li>
        <li><strong>Código postal:</strong> {{ datosPersona.codigoPostal || '-' }}</li>
        <li><strong>Nº camiseta:</strong> {{ datosJugador.numCamiseta || '-' }}</li>
      </ul>
    </div>
    <!-- Perfil deportivo -->
    <div class="bg-white shadow-md rounded-2xl p-6">
      <h3 class="text-xl font-semibold text-indigo-600 mb-4">Perfil deportivo</h3>
      <ul class="space-y-2 text-gray-700">
        <li><strong>Pie dominante:</strong> {{ datosJugador.piernaBuena || '-' }}</li>
        <li><strong>Posición:</strong> {{ datosJugador.posicion || '-' }}</li>
        <li><strong>Equipo: </strong>
          <span v-if="equipo?.nombre" class="text-indigo-700 font-medium">{{ equipo.nombre }}</span>
          <span v-else class="text-gray-400 italic">Sin equipo</span>
        </li>
      </ul>
      <div class="mt-4">
        <p class="text-gray-700"><strong>Biografía:</strong></p>
        <p class="text-gray-600 italic mt-1">{{ datosPersona.biografia || '-' }}</p>
      </div>
    </div>
  </div>

  <!-- Estadísticas -->
  <div class="bg-white shadow-lg rounded-3xl p-6">
    <h3 class="text-2xl font-bold text-center text-indigo-600 mb-6">Estadísticas</h3>
    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 text-center">
      <div class="bg-indigo-100 rounded-xl py-4 shadow-sm">
        <p class="text-3xl font-bold text-indigo-700">{{ stats.goles }}</p>
        <p class="text-gray-600">Goles</p>
      </div>
      <div class="bg-indigo-100 rounded-xl py-4 shadow-sm">
        <p class="text-3xl font-bold text-indigo-700">{{ stats.asistencias }}</p>
        <p class="text-gray-600">Asistencias</p>
      </div>
      <div class="bg-red-100 rounded-xl py-4 shadow-sm">
        <p class="text-3xl font-bold text-red-500">{{ stats.tarjetasRojas }}</p>
        <p class="text-gray-600">Rojas</p>
      </div>
      <div class="bg-yellow-100 rounded-xl py-4 shadow-sm">
        <p class="text-3xl font-bold text-yellow-500">{{ stats.tarjetasAmarillas }}</p>
        <p class="text-gray-600">Amarillas</p>
      </div>
      <div class="bg-green-100 rounded-xl py-4 shadow-sm col-span-2 sm:col-span-1">
        <p class="text-3xl font-bold text-green-600">{{ stats.partidosJugados }}</p>
        <p class="text-gray-600">Partidos</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, reactive, computed } from 'vue';
import axios from 'axios';

axios.defaults.withCredentials = true

const datosUsuario = ref<{ id: number; Nombreusu: string; correo: string }>({ id: 0, Nombreusu: '', correo: '' })

const datosPersona = ref<any>({})
const datosJugador = ref<any>({})
const equipo = ref<{ id: number; nombre: string } | null>(null)
const fotoPerfil = ref<string>('')
const stats = ref({
  goles: 0,
  asistencias: 0,
  tarjetasRojas: 0,
  tarjetasAmarillas: 0,
  partidosJugados: 0
})

const form = reactive({
  persona: {
    nombre: '',
    primer_apellido: '',
    segundo_apellido: '',
    fechaNac: '',
    sexo: '' as 'hombre' | 'mujer' | '',
    peso: null as number | null,
    altura: null as number | null,
    municipio: '',
    direccion: '',
    biografia: '',
  },
  jugador: {
    numCamiseta: null as number | null,
    piernaBuena: '' as 'diestro' | 'zurdo' | 'ambidiestro' | ''
  }
})
const fileInput = ref<HTMLInputElement | null>(null)
const mensaje = ref('')
const cargando = ref(true)
const emit = defineEmits<{
  (e: 'volver-menu'): void
  (e: 'perfil-guardado', completo: boolean): void
}>()

const perfilCompleto = computed(() => {
  const p = form.persona
  const j = form.jugador
  return (
    !!p.nombre.trim() &&
    !!p.primer_apellido.trim() &&
    !!p.fechaNac &&
    !!p.sexo &&
    j.numCamiseta !== null &&
    !!j.piernaBuena
  )
})

const obtenerDatosUsuario = async () => {
  try {
    console.log("Obteniendo datos del usuario...")
    const { data } = await axios.get('http://localhost:3000/usuarios/usuario-actual', {
      withCredentials: true
    })
    console.log("Persona:", data.persona)
    console.log("Respuesta:", data)
    if (!data.success) throw new Error('No autenticado')
    datosUsuario.value = {
      id: data.id,
      Nombreusu: data.Nombreusu,
      correo: data.correo
    }

    datosPersona.value = data.persona || {}
    datosJugador.value = data.jugador || {}
    fotoPerfil.value = data.foto || fotoPerfil.value
    const eq = await axios.get('http://localhost:3000/equipos/mi-equipo')
    equipo.value = eq.data.equipo || null

    if (data.stats) {
      stats.value = {
        goles: data.stats.goles,
        asistencias: data.stats.asistencias,
        tarjetasRojas: data.stats.tarjetasRojas,
        tarjetasAmarillas: data.stats.tarjetasAmarillas,
        partidosJugados: data.stats.partidosJugados
      }
    }

  } catch (e) {
    console.log('Error cargando perfil:', e)
  }
}

const guardarDatos = async () => {
  mensaje.value = ''
  try {
    const payload = {
      persona: form.persona,
      jugador: form.jugador
    }

    const response = await axios.post(`http://localhost:3000/usuarios/${datosUsuario.value.id}/perfil`, payload)


    mensaje.value = 'Datos guardados correctamente'
    console.log('Respuesta del servidor:', response.data)
    await obtenerDatosUsuario()
    emit('perfil-guardado', perfilCompleto.value)
  } catch {
    mensaje.value = 'Error al guardar datos'
    emit('perfil-guardado', false)
  } finally {
    setTimeout(() => {
      mensaje.value = '';
      emit('volver-menu');
    }, 1000);
  }
}

const openFilePicker = () => {
  fileInput.value?.click()
}

const handleFileUpload = async (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = () => {
    fotoPerfil.value = reader.result as string
  }
  reader.readAsDataURL(file)

  const formData = new FormData()
  formData.append('foto', file)
  formData.append('nombreusu', datosUsuario.value.Nombreusu)

  try {
    const res = await axios.post('http://localhost:3000/usuarios/subir-foto', formData)
    if (res.data.success) {
      fotoPerfil.value = res.data.urlFoto
    }
  } catch (err) {
    console.error(err)
  }
}

onMounted(obtenerDatosUsuario)
</script>

<style scoped>
input {
  outline: none;
}
</style>