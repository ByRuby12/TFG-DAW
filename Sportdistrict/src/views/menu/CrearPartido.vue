<template>
    <div class="mx-auto p-8 bg-white rounded-2xl shadow-lg">
        <h2 class="text-3xl font-bold text-center text-gray-800 mb-8">Gestión de Partidos</h2>
        <div class="flex flex-wrap justify-center gap-2 md:gap-4 mb-8">
            <button :class="['px-4 py-1.5 md:px-6 md:py-2 rounded-lg text-sm md:text-base text-white font-medium transition duration-300 ease-in-out',
                tab === 'mios' ? 'bg-indigo-700' : 'bg-indigo-500 hover:bg-indigo-600']" @click="tab = 'mios'">
                Mis partidos
            </button>
            <button :class="['px-4 py-1.5 md:px-6 md:py-2 rounded-lg text-sm md:text-base text-white font-medium transition duration-300 ease-in-out',
                tab === 'crear' ? 'bg-indigo-700' : 'bg-indigo-500 hover:bg-indigo-600']" @click="tab = 'crear'">
                Crear partido
            </button>
            <button :class="['px-4 py-1.5 md:px-6 md:py-2 rounded-lg text-sm md:text-base text-white font-medium transition duration-300 ease-in-out',
                tab === 'comunitarios' ? 'bg-indigo-700' : 'bg-indigo-500 hover:bg-indigo-600']"
                @click="tab = 'comunitarios'">
                Partidos comunitarios
            </button>
        </div>

        <div v-if="tab === 'mios'">
            <div v-if="misPartidos.length === 0" class="text-center text-gray-500">
                No tienes partidos registrados.
            </div>
            <div v-else>
                <div v-for="p in paginatedMisPartidos" :key="p.id"
                    class="bg-white border border-indigo-200 rounded-2xl shadow-md p-6 transition hover:shadow-xl hover:-translate-y-1 mb-4">
                    <div class="flex items-center justify-between mb-2 cursor-pointer group" @click="p._expand = !p._expand">
                        <span class="text-indigo-700 font-bold text-xl flex items-center gap-2">
                            {{ p.equipoLocal?.siglas || p.equipoLocal?.nombre || 'Equipo Local' }}
                            <span class="text-gray-500">vs</span>
                            {{ p.equipoVisitante?.siglas || p.equipoVisitante?.nombre || 'Equipo Visitante' }}
                            <svg :class="[p._expand ? 'rotate-180' : '', 'transition-transform duration-200']" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5 text-indigo-500">
                              <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                            </svg>
                        </span>
                        <div class="text-right space-y-1">
                            <span class="block text-sm bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full">{{ formatFecha(p.fechaInicio) }}</span>
                            <span v-if="p.estado" :class="['inline-block px-3 py-1 rounded-full text-xs font-semibold',
                              p.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-800 border border-yellow-300' :
                              p.estado === 'activo' ? 'bg-green-100 text-green-800 border border-green-300' :
                              p.estado === 'terminado' ? 'bg-gray-200 text-gray-700 border border-gray-300' :
                              p.estado === 'asignado' ? 'bg-blue-100 text-blue-800 border border-blue-300' :
                              p.estado === 'rechazado' ? 'bg-red-100 text-red-700 border border-red-300' :
                              'bg-gray-100 text-gray-500 border border-gray-200'
                            ]">
                              {{ p.estado.charAt(0).toUpperCase() + p.estado.slice(1) }}
                            </span>
                        </div>
                    </div>
                    <transition name="fade">
                      <div v-if="p._expand" class="mt-3 border-t pt-3 space-y-1 animate-fade-in">
                        <div class="mb-2 flex flex-wrap gap-2 items-center">
                          <span class="font-semibold text-gray-700">{{ p.equipoLocal?.nombre || 'Equipo Local' }}</span>
                          <span class="mx-2 text-gray-400">vs</span>
                          <span class="font-semibold text-gray-700">{{ p.equipoVisitante?.nombre || 'Equipo Visitante' }}</span>
                        </div>
                        <p class="text-sm text-gray-600"><span class="font-semibold">Descripción:</span> {{ p.descripcion || 'Sin descripción' }}</p>
                        <p class="text-sm text-gray-600"><span class="font-semibold">Estadio:</span> {{ p.estadio }}</p>
                        <p class="text-sm text-gray-600"><span class="font-semibold">Hora:</span> {{ formatTime(p.fechaInicio) }}</p>
                        <p class="text-sm text-gray-600"><span class="font-semibold">Árbitro:</span> {{ p.arbitro?.persona ? p.arbitro.persona.nombre + ' ' + p.arbitro.persona.primer_apellido : (p.arbitro?.Nombreusu || '-') }}</p>
                      </div>
                    </transition>
                </div>
                <div class="flex justify-center space-x-2 mt-4 sm:mt-6" v-if="totalPagesMisPartidos > 1">
                    <button @click="prevPageMisPartidos" :disabled="currentPageMisPartidos === 1"
                        class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 transition duration-300">
                        Anterior
                    </button>
                    <span class="text-lg font-semibold text-gray-800">{{ currentPageMisPartidos }} / {{ totalPagesMisPartidos }}</span>
                    <button @click="nextPageMisPartidos" :disabled="currentPageMisPartidos === totalPagesMisPartidos"
                        class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 transition duration-300">
                        Siguiente
                    </button>
                </div>
            </div>
        </div>

        <div v-if="tab === 'crear'" class="space-y-6">
            <h3 class="text-2xl font-semibold text-gray-800 mb-4">Crear un nuevo partido</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-1">Equipo Local</label>
                    <div class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-gray-100 text-gray-700 shadow-sm">
                        {{ miEquipo?.nombre || 'Mi equipo' }}
                    </div>
                </div>
                <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-1" for="equipoVisitante">Equipo
                        Visitante</label>
                    <select v-model="form.equipoVisitanteId"
                        class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500">
                        <option disabled value="" class="px-4 py-2 hover:bg-indigo-100 cursor-pointer">Equipo Visitante
                        </option>
                        <option v-for="e in opcionesVisitantes" :value="e.id" :key="e.id"
                            class="px-4 py-2 hover:bg-indigo-100 cursor-pointer">{{ e.nombre }}</option>
                    </select>
                </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-1">Árbitro</label>
                    <select v-model="form.arbitroId"
                        class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500">
                        <option disabled value="" class="px-4 py-2 hover:bg-indigo-100 cursor-pointer">Elige un árbitro
                        </option>
                        <option v-for="a in arbitros" :key="a.id" :value="a.id">
                            <template v-if="a.persona" class="px-4 py-2 hover:bg-indigo-100 cursor-pointer">
                                {{ a.persona.nombre }} {{ a.persona.primer_apellido }}
                                <span v-if="a.persona.segundo_apellido"
                                    class="px-4 py-2 hover:bg-indigo-100 cursor-pointer"> {{ a.persona.segundo_apellido
                                    }}</span>
                            </template>
                            <template v-else class="px-4 py-2 hover:bg-indigo-100 cursor-pointer">
                                {{ a.Nombreusu }}
                            </template>
                        </option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-1">Fecha y Hora</label>
                    <input v-model="form.fechaInicio" type="datetime-local"
                        class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500">
                </div>
            </div>

            <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1" for="estadio">Estadio</label>
                <input v-model="form.estadio" list="estadios-list" placeholder="Dirección del estadio..."
                    class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500">
                <datalist id="estadios-list">
                    <option v-for="(e, i) in estadios" :key="i" :value="e.direccion"></option>
                </datalist>
            </div>

            <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1" for="descripcion">Descripción</label>
                <textarea v-model="form.descripcion"
                    placeholder="Describe el tipo de partido, reglas especiales o detalles relevantes..."
                    class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500"></textarea>
            </div>

            <div>
                <button @click="crearPartido"
                    class="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">Crear
                    Partido</button>
            </div>
        </div>

        <div v-if="tab === 'comunitarios'">
            <div v-if="comunitarios.length === 0" class="text-center text-gray-500">
                No hay partidos comunitarios disponibles.
            </div>
            <div v-else>
                <div v-for="p in paginatedComunitarios" :key="p.id"
                    class="bg-white border border-indigo-200 rounded-2xl shadow-md p-6 transition hover:shadow-xl hover:-translate-y-1 mb-4">
                    <div class="flex items-center justify-between mb-2 cursor-pointer group" @click="p._expand = !p._expand">
                        <span class="text-indigo-700 font-bold text-xl flex items-center gap-2">
                            {{ p.equipoLocal?.siglas || '-' }} <span class="text-gray-500">vs</span> {{ p.equipoVisitante?.siglas || '-' }}
                            <svg :class="[p._expand ? 'rotate-180' : '', 'transition-transform duration-200']" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5 text-indigo-500">
                              <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                            </svg>
                        </span>
                        <div class="text-right space-y-1">
                            <span class="block text-sm bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full">
                                {{ formatFecha(p.fechaInicio) }}
                            </span>
                            <span v-if="p.estado" :class="['inline-block px-3 py-1 rounded-full text-xs font-semibold',
                              p.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-800 border border-yellow-300' :
                              p.estado === 'activo' ? 'bg-green-100 text-green-800 border border-green-300' :
                              p.estado === 'terminado' ? 'bg-gray-200 text-gray-700 border border-gray-300' :
                              p.estado === 'asignado' ? 'bg-blue-100 text-blue-800 border border-blue-300' :
                              p.estado === 'rechazado' ? 'bg-red-100 text-red-700 border border-red-300' :
                              'bg-gray-100 text-gray-500 border border-gray-200'
                            ]">
                              {{ p.estado.charAt(0).toUpperCase() + p.estado.slice(1) }}
                            </span>
                        </div>
                    </div>
                    <transition name="fade">
                      <div v-if="p._expand" class="mt-3 border-t pt-3 space-y-1 animate-fade-in">
                        <div class="mb-2 flex flex-wrap gap-2 items-center">
                          <span class="font-semibold text-gray-700">{{ p.equipoLocal?.nombre || 'Equipo Local' }}</span>
                          <span class="mx-2 text-gray-400">vs</span>
                          <span class="font-semibold text-gray-700">{{ p.equipoVisitante?.nombre || 'Equipo Visitante' }}</span>
                        </div>
                        <p class="text-sm text-gray-600"><span class="font-semibold">Descripción:</span> {{ p.descripcion || 'Sin descripción' }}</p>
                        <p class="text-sm text-gray-600"><span class="font-semibold">Estadio:</span> {{ p.estadio }}</p>
                        <p class="text-sm text-gray-600"><span class="font-semibold">Hora:</span> {{ formatTime(p.fechaInicio) }}</p>
                        <p class="text-sm text-gray-600"><span class="font-semibold">Árbitro:</span> {{ p.arbitro?.persona ? p.arbitro.persona.nombre + ' ' + p.arbitro.persona.primer_apellido : (p.arbitro?.Nombreusu || '-') }}</p>
                      </div>
                    </transition>
                </div>
                <div class="flex justify-center space-x-2 mt-4 sm:mt-6" v-if="totalPagesComunitarios > 1">
                    <button @click="prevPageComunitarios" :disabled="currentPageComunitarios === 1"
                        class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 transition duration-300">
                        Anterior
                    </button>
                    <span class="text-lg font-semibold text-gray-800">{{ currentPageComunitarios }} / {{ totalPagesComunitarios }}</span>
                    <button @click="nextPageComunitarios" :disabled="currentPageComunitarios === totalPagesComunitarios"
                        class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 transition duration-300">
                        Siguiente
                    </button>
                </div>
            </div>
        </div>

    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import axios from 'axios';

const props = defineProps<{ equipoId: number | null }>()
const emit = defineEmits<{
    (e: 'volver-menu'): void
}>()
const tab = ref<'mios' | 'crear' | 'comunitarios'>('mios')
const misPartidos = ref<any[]>([])
const comunitarios = ref<any[]>([])
const misEquipos = ref<any[]>([])
const estadios = ref<{ direccion: string }[]>([])

const form = ref({
    equipoLocalId: null as number | null,
    equipoVisitanteId: null as number | null,
    descripcion: '',
    fechaInicio: '',
    estadio: '',
    codigoPostal: '',
    arbitroId: null as number | null
})
interface Arbitro {
    id: number
    Nombreusu: string
    persona: {
        nombre: string
        primer_apellido: string
        segundo_apellido?: string
    }
}
const arbitros = ref<Arbitro[]>([])
const todosEquipos = ref<any[]>([])
const opcionesLocales = computed(() =>
    todosEquipos.value.filter(e => e.id !== form.value.equipoVisitanteId)
)

const opcionesVisitantes = computed(() =>
    todosEquipos.value.filter(e => miEquipo.value && e.id !== miEquipo.value.id)
)

const fetchMisEquipos = async () => {
    const { data } = await axios.get('http://localhost:3000/equipos/mi-equipo', { withCredentials: true })
    misEquipos.value = data.equipo ? [data.equipo] : []
}

const fetchMisPartidos = async () => {
    const { data } = await axios.get('http://localhost:3000/partidos/mios', { withCredentials: true })
    console.log('mios →', data);
    misPartidos.value = data
    console.log('misPartidos raw:', misPartidos.value);
}

const fetchComunitarios = async () => {
    const { data } = await axios.get('http://localhost:3000/partidos/comunitarios', { withCredentials: true })
    comunitarios.value = data
}

const formatFecha = (raw: string) => {
    const d = new Date(raw)
    return d.toLocaleDateString([], { year: 'numeric', month: '2-digit', day: '2-digit' })
}

const formatTime = (raw: string) => {
    const d = new Date(raw)
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

const fetchTodosEquipos = async () => {
    const { data } = await axios.get('http://localhost:3000/equipos', { withCredentials: true })
    todosEquipos.value = data
}

const fetchArbitros = async () => {
    try {
        const { data } = await axios.get<Arbitro[]>(
            'http://localhost:3000/usuarios/arbitros-usuarios',
            { withCredentials: true }
        )
        console.log('🔍 arbitros desde backend:', data);
        arbitros.value = data;
    } catch (e) {
        console.error('Error al cargar árbitros de usuarios', e);
    }
}

const crearPartido = async () => {
    // Asegurarse de que el equipo local es el del usuario
    if (miEquipo.value) {
        form.value.equipoLocalId = miEquipo.value.id
    }
    await axios.post('http://localhost:3000/partidos', form.value, { withCredentials: true })
    // Resetear el formulario después de crear el partido
    form.value = {
        equipoLocalId: miEquipo.value ? miEquipo.value.id : null,
        equipoVisitanteId: null,
        descripcion: '',
        fechaInicio: '',
        estadio: '',
        codigoPostal: '',
        arbitroId: null
    }
    await fetchMisPartidos()
    tab.value = 'mios'
}


const pageSize = 5
// Mis partidos paginados
const currentPageMisPartidos = ref(1)
const totalPagesMisPartidos = computed(() => Math.ceil(misPartidos.value.length / pageSize))
const paginatedMisPartidos = computed(() => {
    const start = (currentPageMisPartidos.value - 1) * pageSize
    return misPartidos.value.slice(start, start + pageSize)
})
function prevPageMisPartidos() {
    if (currentPageMisPartidos.value > 1) currentPageMisPartidos.value--
}
function nextPageMisPartidos() {
    if (currentPageMisPartidos.value < totalPagesMisPartidos.value) currentPageMisPartidos.value++
}
watch(misPartidos, () => { currentPageMisPartidos.value = 1 })
// Comunitarios paginados
const currentPageComunitarios = ref(1)
const totalPagesComunitarios = computed(() => Math.ceil(comunitarios.value.length / pageSize))
const paginatedComunitarios = computed(() => {
    const start = (currentPageComunitarios.value - 1) * pageSize
    return comunitarios.value.slice(start, start + pageSize)
})
function prevPageComunitarios() {
    if (currentPageComunitarios.value > 1) currentPageComunitarios.value--
}
function nextPageComunitarios() {
    if (currentPageComunitarios.value < totalPagesComunitarios.value) currentPageComunitarios.value++
}
watch(comunitarios, () => { currentPageComunitarios.value = 1 })

const miEquipo = computed(() => misEquipos.value.length > 0 ? misEquipos.value[0] : null)

onMounted(async () => {
    await Promise.all([
        fetchMisEquipos(),
        fetchMisPartidos(),
        fetchComunitarios(),
        fetchTodosEquipos(),
        fetchArbitros()
    ])

    try {
        const { data } = await axios.get<{ direccion: string }[]>('http://localhost:3000/estadios', { withCredentials: true })
        estadios.value = data
    } catch (err) {
        console.log('Error cargando estadios:', err)
        estadios.value = []
    }
})

watch(miEquipo, (nuevo) => {
    if (nuevo && form.value) {
        form.value.equipoLocalId = nuevo.id
    }
}, { immediate: true })
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>