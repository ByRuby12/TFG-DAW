<template>
<div class="mx-auto p-8 bg-white rounded-2xl shadow-lg">
    <h1 class="text-3xl font-bold text-gray-800 mb-8 text-center">Crear Reportes</h1>
    <div class="flex justify-center gap-4 mb-6 sm:mb-8 flex-wrap">
        <button @click="seccionActiva = 'crearReporte'"
        :class="seccionActiva === 'crearReporte'
          ? 'bg-indigo-700 text-white'
          : 'bg-indigo-500 hover:bg-indigo-600 text-white'"
        class="px-4 py-1.5 md:px-6 md:py-2 rounded-lg text-sm md:text-base font-medium transition duration-300 ease-in-out">
        Crear reporte
        </button>
        <button @click="seccionActiva = 'misReportes'"
        :class="seccionActiva === 'misReportes'
          ? 'bg-indigo-700 text-white'
          : 'bg-indigo-500 hover:bg-indigo-600 text-white'"
        class="px-4 py-1.5 md:px-6 md:py-2 rounded-lg text-sm md:text-base font-medium transition duration-300 ease-in-out">
        Mis Reportes
        </button>
    </div>
    <div v-if="seccionActiva === 'crearReporte'" class="bg-indigo-50 rounded-2xl p-6 sm:p-8 mb-10">
        <h3 class="text-xl sm:text-2xl font-bold text-indigo-700 mb-6">Crear un nuevo reporte</h3>
        <form @submit.prevent="guardarReporte" class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="col-span-1 md:col-span-2">
                <label class="block mb-2 text-sm font-medium text-gray-700">Título</label>
                <input v-model="nuevoReporte.titulo" type="text" placeholder="Escribe un título breve"             class="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400" required>
            </div>
            <div>
                <label class="block mb-2 text-sm font-medium text-gray-700">Tipo de Reporte</label>
                <select v-model="nuevoReporte.tipo" class="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400" required>
                    <option disabled value="">Selecciona uno</option>
                    <option>Bug</option>
                    <option>Partido</option>
                    <option>Equipo</option>
                    <option>Solicitud acceso árbitro</option>
                    <option>Solicitud acceso administrador</option>
                    <option>Eliminar cuenta</option>
                </select>
            </div>
            <div>
                <label class="block mb-2 text-sm font-medium text-gray-700">Correo electrónico</label>
                <input v-model="nuevoReporte.correo" type="email" placeholder="tu@correo.com" class="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400" required>
            </div>
            <div class="col-span-1 md:col-span-2">
            <label class="block mb-2 text-sm font-medium text-gray-700">Descripción detallada</label>
            <textarea v-model="nuevoReporte.descripcion" rows="5" placeholder="Describe con detalle tu reporte o solicitud..." class="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400" required></textarea>
            </div>
            <div class="col-span-1 md:col-span-2 flex justify-end gap-4">
                <button type="reset" @click="resetFormulario" class="px-6 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition">
                    Borrar
                </button>
                <button type="submit" class="px-6 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition">
                    Enviar
                </button>
            </div>
        </form>
    </div>
    <div v-if="seccionActiva === 'misReportes'" class="rounded-2xl">
        <div v-if="paginatedReports.length" class="space-y-4">
            <div v-for="reporte in paginatedReports" :key="reporte.id" class="p-4 bg-white rounded-xl shadow-md flex flex-col sm:flex-row justify-between gap-2 sm:items-center">
                <div class="flex-1">
                    <h4 class="font-semibold text-base sm:text-lg text-gray-800 mb-1 sm:mb-0">{{ reporte.titulo }}</h4>
                    <p class="text-sm text-gray-600">Tipo: {{ reporte.tipo }}</p>
                    <p class="text-sm text-gray-600">
                        Estado:
                        <span :class="{
                        'text-yellow-500': reporte.estado === 'Pendiente',
                        'text-green-600': reporte.estado === 'Completado',
                        'text-red-600': reporte.estado === 'Rechazado'
                        }">
                            {{ reporte.estado }}
                        </span>
                    </p>
                </div>
                <div class="text-sm text-gray-500 sm:text-right">
                    <p class="mb-1">{{ formatFecha(reporte.fecha) }}</p>
                </div>
            </div>
        </div>
        <div v-else class="text-center text-gray-700 mt-10 text-lg">No tienes reportes enviados.</div>
        <div class="flex justify-center items-center space-x-2 mt-6" v-if="totalPages > 1">
            <button @click="prevPage" :disabled="currentPage === 1" class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 transition">
                Anterior
            </button>
            <span class="text-base font-semibold text-gray-800">{{ currentPage }} / {{ totalPages }}</span>
            <button @click="nextPage" :disabled="currentPage === totalPages" class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 transition">
                Siguiente
            </button>
        </div>
    </div>
</div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue';
import axios from 'axios';

interface Reporte {
    id:number
    titulo:string
    tipo:string
    correo:string
    descripcion:string
    estado:'Pendiente' | 'Completado' | 'Rechazado'
    fecha:string
}
const seccionActiva = ref<'crearReporte' | 'misReportes'>('misReportes')
const reportsPerPage = 5
const currentPage = ref(1)
const reports = ref<Reporte[]>([])
const nuevoReporte = reactive({
    titulo:'',
    tipo:'',
    correo:'',
    descripcion:''
})
const totalPages = computed(() =>
  Math.ceil(reports.value.length / reportsPerPage))
const paginatedReports = computed(() => {
  const start = (currentPage.value -1) * reportsPerPage
  return reports.value.slice(start, start + reportsPerPage)
})
function nextPage() {
  if(currentPage.value < totalPages.value) currentPage.value++
}
function prevPage() {
  if(currentPage.value > 1) currentPage.value--
}
watch(reports, () => { currentPage.value = 1 })
const resetFormulario = () =>{
    nuevoReporte.titulo = ''
    nuevoReporte.tipo = ''
    nuevoReporte.correo = ''
    nuevoReporte.descripcion = ''
}

const formatFecha = (raw: string) => {
    const d = new Date(raw)
    return d.toLocaleDateString([], { year: 'numeric', month: '2-digit', day: '2-digit' })
}

const formatTime = (raw: string) => {
    const d = new Date(raw)
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}


const guardarReporte = async() =>{
    try{
    const { data } = await axios.post<Reporte>(
    'http://localhost:3000/reportes',
    { ...nuevoReporte },
    { withCredentials: true }
    )
    reports.value.unshift({
        ...data,
        estado: 'Pendiente',
        fecha: new Date().toLocaleDateString()
    })
    resetFormulario()
    seccionActiva.value = 'misReportes'
    currentPage.value = 1
    } catch(err){
        console.error('Error al guardar reporte', err)
        alert('No fue posible enviar el reporte')
    }
}
const loadMisReportes = async() => {
    try{
    const { data } = await axios.get<Reporte[]>(
    'http://localhost:3000/reportes/mios',
    { withCredentials: true }
    )
    reports.value = data
    } catch(err){
        console.error('Error al cargar reportes', err)
    }
}
onMounted(() => {
    loadMisReportes()
})
</script>

<style scoped>

</style>