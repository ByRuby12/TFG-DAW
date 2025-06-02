<template>
    <div class="mx-auto p-8 bg-white rounded-2xl shadow-lg">
        <h1 class="text-3xl font-bold text-gray-800 mb-8 text-center">Panel Arbitro</h1>
        <div v-if="!seleccionado">
            <div v-if="partidos.length" class="space-y-4">
                <div v-for="p in partidosPaginados" :key="p.id"
                    class="bg-white p-4 sm:p-6 rounded-lg shadow-lg flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <div class="mb-2 sm:mb-0 w-full">
                        <p class="font-semibold text-lg sm:text-xl text-blue-700">{{ p.equipoLocal?.nombre }} vs {{
                            p.equipoVisitante?.nombre }}
                        </p>
                        <p class="text-sm text-gray-600">Fecha: {{ formatFecha(p.fechaInicio) }}</p>
                        <p class="text-sm text-gray-600">Hora: {{ formatTime(p.fechaInicio) }}</p>
                        <p class="text-sm text-gray-600">Dirección: {{ p.estadio }}</p>
                    </div>
                    <div class="flex gap-2 w-full sm:w-auto justify-between sm:justify-start mt-2 sm:mt-0">
                        <button
                            class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg transition duration-300"
                            @click="aceptar(p)">Aceptar</button>
                        <button
                            class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg transition duration-300"
                            @click="rechazar(p.id)">Rechazar</button>
                    </div>
                </div>
            </div>
            <p v-else class="text-center text-gray-600">No tienes partidos asignados.</p>
        </div>

<div v-else class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center px-2 sm:px-0">
    <div class="bg-white p-2 sm:p-8 rounded-lg shadow-lg max-w-4xl w-full overflow-y-auto max-h-[98vh]">
        <h2 class="text-xl sm:text-2xl font-bold text-blue-700 mb-4 sm:mb-7 text-center">
            {{ seleccionado.equipoLocal.nombre }} vs {{ seleccionado.equipoVisitante.nombre }}
        </h2>

        <!-- GOLES -->
        <section class="mb-4 sm:mb-6">
            <label class="block text-sm font-semibold text-gray-700 mb-1">Goles</label>
            <div v-if="seleccionado.goles && seleccionado.goles.length > 2" class="mb-2">
                <button @click="showAllGoles = !showAllGoles" class="text-blue-700 font-semibold underline mb-2">
                    {{ showAllGoles ? 'Mostrar menos' : 'Mostrar todos (' + seleccionado.goles.length + ')' }}
                </button>
            </div>
            <div v-for="(g, i) in (seleccionado.goles.length > 2 && !showAllGoles ? seleccionado.goles.slice(0, 2) : seleccionado.goles)" :key="i" class="mb-2">
                <div @click="toggleOpen(g, 'gol', i)" class="flex items-center justify-between bg-blue-50 rounded-lg px-3 py-2 cursor-pointer select-none">
                    <span class="font-semibold text-blue-700 text-sm">Gol {{ i + 1 }} - {{ g.jugador || 'Sin jugador' }}</span>
                    <span class="text-blue-600">{{ g.__open ? '▲' : '▼' }}</span>
                </div>
                <transition name="fade">
                    <div v-show="g.__open" class="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-2 bg-blue-50 rounded-lg p-2">
                        <select v-model="g.equipo" class="border p-2 sm:p-3 rounded-lg w-full sm:w-1/4 focus:ring-2 focus:ring-blue-500">
                            <option disabled value="">Equipo</option>
                            <option value="local">{{ seleccionado.equipoLocal.nombre }}</option>
                            <option value="visitante">{{ seleccionado.equipoVisitante.nombre }}</option>
                        </select>
                        <select v-model="g.jugador" class="border p-2 sm:p-3 rounded-lg w-full sm:w-1/4 focus:ring-2 focus:ring-blue-500">
                            <option disabled value="">Jugador</option>
                            <option v-for="name in g.equipo === 'local' ? localPlayers : visitingPlayers" :key="name" :value="name">{{ name }}</option>
                        </select>
                        <select v-model="g.asistidoPor" class="border p-2 sm:p-3 rounded-lg w-full sm:w-1/4 focus:ring-2 focus:ring-blue-500">
                            <option disabled value="">Asistido por</option>
                            <option v-for="name in g.equipo === 'local' ? localPlayers : visitingPlayers" :key="name + '-assist'" :value="name">{{ name }}</option>
                        </select>
                        <select v-model="g.tipo" class="border p-2 sm:p-3 rounded-lg w-full sm:w-1/4 focus:ring-2 focus:ring-blue-500">
                            <option value="normal">Normal</option>
                            <option value="penalti">Penalti</option>
                            <option value="falta">Falta</option>
                            <option value="corner">Córner</option>
                        </select>
                        <input v-model="g.minuto" type="time" class="border p-2 sm:p-3 rounded-lg w-full sm:w-1/4 focus:ring-2 focus:ring-blue-500">
                        <button @click.stop="removeGolEdit(i)" class="text-red-500 self-center">✕</button>
                    </div>
                </transition>
            </div>
            <button @click="addGol" class="text-blue-600 text-sm font-semibold hover:underline">+ Añadir gol</button>
        </section>

        <!-- TARJETAS -->
        <section class="mb-4 sm:mb-6">
            <label class="block text-sm font-semibold text-gray-700 mb-1">Tarjetas</label>
            <div v-if="seleccionado.tarjetas && seleccionado.tarjetas.length > 2" class="mb-2">
                <button @click="showAllTarjetas = !showAllTarjetas" class="text-yellow-700 font-semibold underline mb-2">
                    {{ showAllTarjetas ? 'Mostrar menos' : 'Mostrar todas (' + seleccionado.tarjetas.length + ')' }}
                </button>
            </div>
            <div v-for="(t, i) in (seleccionado.tarjetas.length > 2 && !showAllTarjetas ? seleccionado.tarjetas.slice(0, 2) : seleccionado.tarjetas)" :key="i" class="mb-2">
                <div @click="toggleOpen(t, 'tarjeta', i)" class="flex items-center justify-between bg-yellow-50 rounded-lg px-3 py-2 cursor-pointer select-none">
                    <span class="font-semibold text-yellow-700 text-sm">Tarjeta {{ i + 1 }} - {{ t.jugador || 'Sin jugador' }}</span>
                    <span class="text-yellow-600">{{ t.__open ? '▲' : '▼' }}</span>
                </div>
                <transition name="fade">
                    <div v-show="t.__open" class="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-2 bg-yellow-50 rounded-lg p-2">
                        <select v-model="t.equipo" class="border p-2 sm:p-3 rounded-lg w-full sm:w-1/2 focus:ring-2 focus:ring-blue-500">
                            <option disabled value="">Equipo</option>
                            <option value="local">{{ seleccionado.equipoLocal.nombre }}</option>
                            <option value="visitante">{{ seleccionado.equipoVisitante.nombre }}</option>
                        </select>
                        <select v-model="t.jugador" class="border p-2 sm:p-3 rounded-lg w-full sm:w-1/2 focus:ring-2 focus:ring-blue-500">
                            <option disabled value="">Jugador</option>
                            <option v-for="name in t.equipo === 'local' ? localPlayers : visitingPlayers" :key="name + '-card'" :value="name">{{ name }}</option>
                        </select>
                        <select v-model="t.tipo" class="border p-2 sm:p-3 rounded-lg w-full sm:w-1/2 focus:ring-2 focus:ring-blue-500">
                            <option value="amarilla">Amarilla</option>
                            <option value="roja">Roja</option>
                        </select>
                        <input v-model="t.minuto" type="time" class="border p-2 sm:p-3 rounded-lg w-full sm:w-1/2 focus:ring-2 focus:ring-blue-500" />
                        <button @click.stop="removeTarjetaEdit(i)" class="text-red-500 self-center">✕</button>
                    </div>
                </transition>
            </div>
            <button @click="addTarjeta" class="text-blue-600 text-sm font-semibold hover:underline">+ Añadir tarjeta</button>
        </section>

        <!-- BOTONES FINALES -->
        <div class="flex flex-col sm:flex-row gap-4 justify-between">
            <button @click="guardar" class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition duration-300 w-full sm:w-auto">
                Guardar todos los cambios</button>
            <button @click="cancelar" class="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg transition duration-300 w-full sm:w-auto">
                Cancelar</button>
        </div>
    </div>
</div>


        <div class="flex justify-center space-x-2 mt-4 sm:mt-6" v-if="totalPages > 1 && !seleccionado">
            <button @click="prev" :disabled="page === 1"
                class="px-6 py-3 text-lg font-semibold bg-indigo-600 text-white rounded-xl shadow hover:bg-indigo-700 disabled:bg-gray-300 disabled:text-gray-500 transition duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2">
                ⬅️ Anterior
            </button>
            <span class="text-lg font-bold text-gray-800 flex items-center px-4">{{ page }} / {{ totalPages }}</span>
            <button @click="next" :disabled="page === totalPages"
                class="px-6 py-3 text-lg font-semibold bg-indigo-600 text-white rounded-xl shadow hover:bg-indigo-700 disabled:bg-gray-300 disabled:text-gray-500 transition duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2">
                Siguiente ➡️
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';

interface Partido {
    id: number
    equipoLocal: {
        id: number
        nombre: string
        siglas: string
    }
    equipoVisitante: {
        id: number
        nombre: string
        siglas: string
    }
    fechaInicio: string
    estadio: string
    estado: string
    arbitroId: number
    goles: any[]
    tarjetas: any[]
}

const partidos = ref<Partido[]>([])
const seleccionado = ref<Partido | null>(null)
const page = ref(1)
const perPage = 5
const localPlayers = ref<string[]>([])
const visitingPlayers = ref<string[]>([])
const emit = defineEmits<{
    (e: 'cancelar'): void
}>()
const estadios = ref<{ direccion: string }[]>([])
const editingMatch = ref<any|null>(null)
const showAllGoles = ref(false)
const showAllTarjetas = ref(false)

const partidosPaginados = computed(() => {
    const start = (page.value - 1) * perPage
    return partidos.value.slice(start, start + perPage)
})
const totalPages = computed(() =>
    Math.ceil(partidos.value.length / perPage)
)

const prev = () => {
    if (page.value > 1) page.value--
}
const next = () => {
    if (page.value < totalPages.value) page.value++
}

const formatFecha = (raw: string) => {
    const d = new Date(raw)
    return d.toLocaleDateString([], { year: 'numeric', month: '2-digit', day: '2-digit' })
}

const formatTime = (raw: string) => {
    const d = new Date(raw)
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

const load = async () => {
    const { data } = await axios.get('http://localhost:3000/partidos/arbitro', { withCredentials: true })
    console.log('▶ partidos para arbitrar:', data)
    partidos.value = data
}

const aceptar = async (p: Partido) => {
    await axios.post(`http://localhost:3000/partidos/${p.id}/asignar/${p.arbitroId}`, {}, { withCredentials: true })
    p.estado = 'asignado'
    seleccionado.value = p
    const resLocal = await axios.get<{ jugadores: { Nombreusu: string }[] }>(
        `http://localhost:3000/equipos/${p.equipoLocal.id}/jugadores`,
        { withCredentials: true }
    )
    localPlayers.value = resLocal.data.jugadores.map(j => j.Nombreusu)
    const resVis = await axios.get<{ jugadores: { Nombreusu: string }[] }>(
        `http://localhost:3000/equipos/${p.equipoVisitante.id}/jugadores`,
        { withCredentials: true }
    )
    visitingPlayers.value = resVis.data.jugadores.map(j => j.Nombreusu)
    // Copia profunda para edición
    editingMatch.value = JSON.parse(JSON.stringify(p))
    showAllGoles.value = false
    showAllTarjetas.value = false
}
const rechazar = async (id: number) => {
    await axios.post(`http://localhost:3000/partidos/${id}/rechazar`, {}, { withCredentials: true })
    partidos.value = partidos.value.filter(x => x.id !== id)
}
const addGol = () => {
    seleccionado.value!.goles.push({
        equipo: '',
        jugador: '',
        asistidoPor: '',
        tipo: 'normal',
        minuto: '00:00'
    })
}
const addTarjeta = () => {
    seleccionado.value!.tarjetas.push({
        equipo: '',
        jugador: '',
        tipo: 'amarilla',
        minuto: '00:00'
    })
}
const guardar = async () => {
    await axios.post('http://localhost:3000/partidos/resultados', {
        partidoId: seleccionado.value!.id,
        goles: seleccionado.value!.goles,
        tarjetas: seleccionado.value!.tarjetas
    })
    seleccionado.value = null
    load()
}
function addGolEdit() {
  if (!editingMatch.value) return
  editingMatch.value.goles.push({
    equipo: '', jugador: '', asistidoPor: '', tipo: 'normal', minuto: '00:00', __open: true
  })
}
function removeGolEdit(i: number) {
  if (!editingMatch.value) return
  editingMatch.value.goles.splice(i, 1)
}

function removeTarjetaEdit(i: number) {
  if (!editingMatch.value) return
  editingMatch.value.tarjetas.splice(i, 1)
}
function toggleOpen(obj: any, tipo: 'gol' | 'tarjeta', idx: number) {
  obj.__open = !obj.__open
}
async function saveEditingMatch() {
  if (!editingMatch.value) return
  await axios.post('http://localhost:3000/partidos/resultados', {
    partidoId: editingMatch.value.id,
    goles: editingMatch.value.goles,
    tarjetas: editingMatch.value.tarjetas,
    fechaInicio: editingMatch.value.fechaInicio,
    estadio: editingMatch.value.estadio
  })
  editingMatch.value = null
  await load()
}

onMounted(load)

const cancelar = () => {
    seleccionado.value = null
}
</script>

<style scoped></style>