<template>
    <div class="mx-auto p-8 bg-white rounded-2xl shadow-lg">
        <h1 class="text-3xl font-bold text-gray-800 mb-8 text-center">Panel de Reportes</h1>
        <div class="flex justify-center mb-6 space-x-4">
            <button @click="vista = 'pendientes'" :class="vista === 'pendientes' ? activeBtn : inactiveBtn">
                Pendientes
            </button>
            <button @click="vista = 'gestionados'" :class="vista === 'gestionados' ? activeBtn : inactiveBtn">
                Gestionados
            </button>
        </div>
        <div v-if="items.length" class="space-y-6">
            <div v-for="r in paginated" :key="r.id" class="p-6 bg-indigo-50 rounded-xl shadow-md">
                <div class="flex-1">
                    <h3 class="text-xl font-semibold text-gray-800">{{ r.titulo }}</h3>
                    <p class="text-sm text-gray-600">Tipo: {{ r.tipo }}</p>
                    <p class="text-sm text-gray-600">Email: {{ r.correo }}</p>
                    <p class="text-sm text-gray-600 italic my-2">{{ r.descripcion }}</p>
                    <p class="text-xs text-gray-500">Fecha: {{ formatDate(r.fecha) }}</p>
                    <p class="text-sm font-medium mt-1">
                        Estado: <span :class="estadoClass(r.estado)">{{ r.estado }}</span>
                    </p>
                </div>
                <div class="flex gap-2 w-full sm:w-auto justify-between sm:justify-start mt-2 sm:mt-0">
                    <button v-if="vista === 'pendientes'" @click="cambiar(r.id, 'Completado')"
                        class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg transition duration-300">
                        Aceptar
                    </button>
                    <button v-if="vista === 'pendientes'" @click="cambiar(r.id, 'Rechazado')"
                        class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg transition duration-300">
                        Rechazar
                    </button>
                </div>
            </div>
        </div>
        <div v-else class="text-center text-gray-700 mt-10">No hay reportes disponibles.</div>
        <div v-if="totalPages > 1" class="flex justify-center items-center space-x-2 mt-8">
            <button @click="prev" :disabled="page === 1"
                class="px-4 py-2 bg-indigo-600 text-white rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed transition">
                Anterior
            </button>
            <span class="mx-2 text-gray-700 font-semibold">{{ page }} / {{ totalPages }}</span>
            <button @click="next" :disabled="page === totalPages"
                class="px-4 py-2 bg-indigo-600 text-white rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed transition">
                Siguiente
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import axios from 'axios';

type Estado = 'Pendiente' | 'Completado' | 'Rechazado'
interface Reporte { id: number; titulo: string; tipo: string; correo: string; descripcion: string; fecha: string; estado: Estado }
const vista = ref<'pendientes' | 'gestionados'>('pendientes')
const page = ref(1)
const perPage = ref(4)
const reportes = ref<Reporte[]>([])

onMounted(async () => {
    const path = vista.value === 'pendientes' || vista.value === 'gestionados'
        ? '/reportes/todos'
        : '/reportes/mios'
    reportes.value = (await axios.get<Reporte[]>(`http://localhost:3000${path}`, { withCredentials: true })).data
})

watch(vista, async () => {
    page.value = 1
    reportes.value = (await axios.get<Reporte[]>(`http://localhost:3000/reportes/todos`, { withCredentials: true })).data
})
const items = computed(() => {
    return reportes.value
        .filter(r => vista.value === 'pendientes' ? r.estado === 'Pendiente' : r.estado !== 'Pendiente')
        .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
})
const totalPages = computed(() => Math.ceil(items.value.length / perPage.value))
const paginated = computed(() => {
    const start = (page.value - 1) * perPage.value
    return items.value.slice(start, start + perPage.value)
})
const next = () => {
    if (page.value < totalPages.value) page.value++
}
const prev = () => {
    if (page.value > 1) page.value--
}
const cambiar = async (id: number, estado: Estado) => {
    await axios.put(`http://localhost:3000/reportes/${id}/estado`, { estado }, { withCredentials: true })
    const r = reportes.value.find(x => x.id === id)
    if (r) r.estado = estado
    page.value = 1
}
const formatDate = (iso: string) => new Date(iso).toLocaleDateString()
const estadoClass = (e: Estado) => e === 'Pendiente' ? 'text-yellow-500' : e === 'Completado' ? 'text-green-600' : 'text-red-600'
const activeBtn = 'px-6 py-2 bg-indigo-700 text-white rounded-lg'
const inactiveBtn = 'px-6 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg'

</script>

<style scoped></style>