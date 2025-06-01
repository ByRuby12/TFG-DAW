<template>
    <div class="mx-auto p-8 bg-white rounded-2xl shadow-lg">
        <h2 class="text-3xl font-bold text-center text-gray-800 mb-8">Unirte a un Equipo</h2>
        <div class="mt-4">
            <label class="block text-sm font-semibold text-gray-700">Filtrar equipos</label>
            <input v-model="searchQuery" type="text"
                class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Buscar equipo..." />
        </div>
        <div class="mt-4 space-y-4">
            <div v-for="equipo in equiposFiltradosPag" :key="equipo.id"
                class="flex justify-between items-center p-4 border-2 border-gray-300 rounded-lg shadow-sm">
                <div>
                    <p class="font-semibold text-gray-800">{{ equipo.nombre }}</p>
                    <p class="text-sm text-gray-600">Miembros: {{ equipo.jugadoresCount }} de 10</p>
                </div>
                <button v-if="equipo.jugadoresCount < 10" @click="abrirModalClave(equipo)"
                    class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-300">
                    Unirse
                </button>
                <p v-else class="text-sm text-red-500">Equipo lleno</p>
            </div>
        </div>
        <div class="flex justify-center space-x-2 mt-4 sm:mt-6">
            <button @click="cambiarPagina('anterior')" :disabled="paginaActual === 1"
                class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 transition duration-300">
                Anterior
            </button>
            <span class="text-lg font-semibold text-gray-800">{{ paginaActual }} / {{ totalPaginas }}</span>
            <button @click="cambiarPagina('siguiente')" :disabled="paginaActual === totalPaginas"
                class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 transition duration-300">
                Siguiente
            </button>
        </div>
        <div v-if="equipoSel" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div class="bg-white p-6 rounded-lg shadow-xl w-11/12 max-w-md">
                <h2 class="text-xl font-semibold text-gray-800 mb-4">Clave de acceso para "{{ equipoSel.nombre }}"</h2>
                <input v-model="clave" type="password" placeholder="Introduce la clave de acceso"
                    class="w-full px-4 py-2 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <p v-if="error" class="text-red-500 text-sm">{{ error }}</p>
                <div class="flex justify-end space-x-4">
                    <button @click="equipoSel = null" class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
                        Cancelar
                    </button>
                    <button @click="unirse" class="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
                        Confirmar
                    </button>
                </div>
            </div>
        </div>

    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';

axios.defaults.withCredentials = true

type EquipoListado = { id: number; nombre: string; jugadoresCount: number }

const emit = defineEmits<{
    (e: 'equipo-unido', equipo: { id: number }): void
    (e: 'volver-menu'): void
}>()

const equipos = ref<EquipoListado[]>([])
const searchQuery = ref('')
const paginaActual = ref(1)
const itemsPorPagina = 5
const equipoSel = ref<EquipoListado | null>(null)
const clave = ref('')
const error = ref('')

const fetchEquipos = async () => {
    const { data } = await axios.get<EquipoListado[]>('http://localhost:3000/equipos', { withCredentials: true })
    equipos.value = data
}

const equiposFiltrados = computed(() =>
    equipos.value.filter((e) => e.nombre.toLowerCase().includes(searchQuery.value.toLowerCase()))
)

const totalPaginas = computed(() =>
    Math.ceil(equiposFiltrados.value.length / itemsPorPagina)
)

const equiposFiltradosPag = computed(() => {
    const start = (paginaActual.value - 1) * itemsPorPagina
    return equiposFiltrados.value.slice(start, start + itemsPorPagina)
})

const cambiarPagina = (dir: 'anterior' | 'siguiente') => {
    if (dir === 'anterior' && paginaActual.value > 1) paginaActual.value--
    if (dir === 'siguiente' && paginaActual.value < totalPaginas.value) paginaActual.value++
}

const seleccionarEquipo = (e: EquipoListado) => {
    equipoSel.value = e
    clave.value = ''
    error.value = ''
}

const abrirModalClave = (e: EquipoListado) => {
    equipoSel.value = e
    clave.value = ''
    error.value = ''
}

const unirse = async () => {
    if (!equipoSel.value) return
    try {
        const { data } = await axios.post(`http://localhost:3000/equipos/${equipoSel.value.id}/unirse`, { claveAcceso: clave.value }, { withCredentials: true })
        emit('equipo-unido', data.equipo)
        emit('volver-menu')
    } catch (err: any) {
        error.value = err.response?.data?.message || 'Clave incorrecta'
    }
}

onMounted(fetchEquipos)
</script>

<style scoped></style>