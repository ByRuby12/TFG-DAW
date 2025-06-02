<template>
    <div class="mx-auto p-8 bg-gradient-to-br from-indigo-50 via-white to-indigo-100 rounded-2xl shadow-2xl">
        <div class="mt-8">
            <h2 v-if="equipo"
                class="text-4xl font-extrabold text-indigo-700 mb-8 text-center drop-shadow-lg tracking-wide">
                {{ equipo.nombre }}
            </h2>
            <!-- Sección principal de lema y estadio, solo una vez -->
            <div v-if="equipo" class="mb-8">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <!-- Lema -->
                    <div
                        class="flex flex-col items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-indigo-200 rounded-xl shadow-xl p-10 border-t-4 border-indigo-400 animate-fade-in-up hover:scale-105 hover:shadow-indigo-300/40 transition-transform duration-300 gap-4">
                        <span class="text-3xl">💬</span>
                        <span class="text-2xl font-bold text-indigo-700 text-center">Lema</span>
                        <span class="italic text-indigo-500 text-lg text-center">“{{ equipo.lema }}”</span>
                    </div>
                    <!-- Estadio -->
                    <div
                        class="flex flex-col items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-indigo-200 rounded-xl shadow-xl p-10 border-t-4 border-indigo-400 animate-fade-in-up hover:scale-105 hover:shadow-indigo-300/40 transition-transform duration-300 gap-4">
                        <span class="text-3xl">🏟️</span>
                        <span class="text-2xl font-bold text-indigo-700 text-center">Estadio</span>
                        <span class="font-bold text-indigo-600 text-lg text-center">{{ equipo.estadio }}</span>
                    </div>
                </div>
            </div>
            <div v-if="equipo" class="mb-10">
                <h3 class="text-2xl font-bold text-indigo-700 mb-4 flex items-center gap-2">
                    <span class="text-3xl">👥</span>
                    Jugadores
                </h3>
                <ul class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    <li v-for="j in jugadores" :key="j.id"
                        class="bg-gradient-to-br from-indigo-100 via-white to-indigo-200 p-4 rounded-xl shadow flex items-center border border-indigo-200 hover:scale-105 transition-transform">
                        <div
                            class="flex-shrink-0 w-14 h-14 bg-indigo-400 text-white rounded-full flex items-center justify-center font-extrabold text-2xl shadow-md border-2 border-indigo-200">
                            {{ j.Nombreusu.charAt(0) }}
                        </div>
                        <div class="ml-4">
                            <p class="text-indigo-700 font-bold text-lg">{{ j.Nombreusu }}</p>
                            <p class="text-gray-800 font-medium">{{ j.persona.nombre }} {{ j.persona.primer_apellido }}
                                <span v-if="j.persona.segundo_apellido">{{ j.persona.segundo_apellido }}</span></p>
                            <div class="flex flex-wrap gap-2 mt-1">
                                <span class="text-xs bg-indigo-200 text-indigo-800 px-2 py-0.5 rounded-full">Posición:
                                    {{ j.posicion }}</span>
                                <span class="text-xs bg-green-200 text-green-800 px-2 py-0.5 rounded-full">Pie: {{
                                    j.piernaBuena }}</span>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
            <div v-if="equipo" class="space-y-4">
                <h3 class="text-2xl font-bold text-indigo-700 mb-4 flex items-center gap-2">
                    <span class="text-3xl">📊</span>
                    Estadísticas
                </h3>
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-6">
                    <div
                        class="bg-gradient-to-br from-green-100 via-white to-green-200 p-6 rounded-xl shadow text-center border-t-4 border-green-400">
                        <p class="text-2xl font-extrabold text-green-700">{{ stats.ganados }}</p>
                        <p class="text-sm text-green-800 font-semibold">Ganados</p>
                    </div>
                    <div
                        class="bg-gradient-to-br from-red-100 via-white to-red-200 p-6 rounded-xl shadow text-center border-t-4 border-red-400">
                        <p class="text-2xl font-extrabold text-red-700">{{ stats.perdidos }}</p>
                        <p class="text-sm text-red-800 font-semibold">Perdidos</p>
                    </div>
                    <div
                        class="bg-gradient-to-br from-indigo-100 via-white to-indigo-200 p-6 rounded-xl shadow text-center border-t-4 border-indigo-400">
                        <p class="text-2xl font-extrabold text-indigo-700">{{ stats.jugados }}</p>
                        <p class="text-sm text-indigo-800 font-semibold">Jugados</p>
                    </div>
                    <div
                        class="bg-gradient-to-br from-yellow-100 via-white to-yellow-200 p-6 rounded-xl shadow text-center border-t-4 border-yellow-400">
                        <p class="text-2xl font-extrabold text-yellow-700">{{ stats.golesTotales }}</p>
                        <p class="text-sm text-yellow-800 font-semibold">Goles</p>
                    </div>
                </div>
            </div>
            <div class="flex flex-wrap justify-center gap-4 mt-8">
                <button v-if="isCapitan" @click="abrirEdicion"
                    class="px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg hover:bg-indigo-700 transition w-full sm:w-auto">
                    Editar equipo
                </button>
                <button v-if="isMiembro" @click="salirEquipo"
                    class="px-8 py-3 bg-yellow-500 text-white font-bold rounded-xl shadow-lg hover:bg-yellow-600 transition w-full sm:w-auto">
                    Salir del equipo
                </button>
            </div>
            <div v-if="editando" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                <div
                    class="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto space-y-6">
                    <h3 class="text-2xl font-bold text-gray-800">Editar equipo</h3>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Nombre del Equipo</label>
                            <input v-model="form.nombre"
                                class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300"
                                placeholder="Introduce el nombre del equipo" />
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Siglas del Equipo</label>
                            <input v-model="form.siglas" maxlength="3"
                                class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300"
                                placeholder="Introduce las siglas del equipo" />
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Color del Equipo</label>
                            <input v-model="form.color" type="color"
                                class="w-16 h-10 border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Dirección del estadio</label>
                            <input v-model="form.estadio" list="estadios-list" placeholder="Buscar dirección..."
                                class="w-full border px-3 py-2 rounded-lg" required>
                            <datalist id="estadios-list">
                                <option v-for="(e, i) in estadios" :key="i" :value="e.direccion" />
                            </datalist>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Lema del Equipo</label>
                            <textarea v-model="form.lema" required minlength="5"
                                class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="Introduce el lema del equipo"></textarea>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Clave de acceso</label>
                            <input v-model="form.claveAcceso" maxlength="4"
                                class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="Clave de acceso" />
                        </div>
                    </div>
                    <div class="flex justify-end space-x-4">
                        <button @click="cancelarEdicion"
                            class="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition">
                            Cancelar
                        </button>
                        <button @click="actualizarEquipo"
                            class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
                            Guardar cambios
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue';
import axios from 'axios';

const props = defineProps<{ equipoId: number | null }>()
const emit = defineEmits<{
    (e: 'volver-menu'): void
    (e: 'salio-equipo'): void
    (e: 'actualizar-rol'): void
}>()

const currentUser = ref<{ id: number } | null>(null)
const jugadores = ref<{ id: number; Nombreusu: string; edad: number; posicion: string; piernaBuena: string, persona: { nombre: string; primer_apellido: string; segundo_apellido?: string } }[]>([])
const estadios = ref<{ direccion: string }[]>([]);
const equipo = ref<any>(null)
const editando = ref(false)
const isCapitan = ref(false)
const isMiembro = computed(() => equipo.value !== null)
const form = ref({
    nombre: '',
    siglas: '',
    lema: '',
    color: '',
    claveAcceso: '',
    estadio: ''
})

const stats = ref({ ganados: 0, perdidos: 0, jugados: 0, golesTotales: 0 })
const fetchCurrentUser = async () => {
    try {
        const { data } = await axios.get('http://localhost:3000/usuarios/me', { withCredentials: true })
        if (data.success) currentUser.value = { id: data.id }
    } catch {

    }
}
const fetchJugadores = async () => {
    if (!props.equipoId) return

    const resJ = await axios.get(
        `http://localhost:3000/equipos/${props.equipoId}/jugadores`,
        { withCredentials: true }
    )
    jugadores.value = resJ.data.jugadores

    const resE = await axios.get<{ equipo: any; isCaptain: boolean; estadisticas: { jugados: number; ganados: number; perdidos: number; golesTotales: number } }>(
        `http://localhost:3000/equipos/mi-equipo`,
        { withCredentials: true }
    )
    equipo.value = resE.data.equipo
    isCapitan.value = resE.data.isCaptain
    stats.value = resE.data.estadisticas || stats.value
}

const fetchEstadios = async () => {
    try {
        const { data } = await axios.get<{ direccion: string }[]>('http://localhost:3000/estadios', { withCredentials: true });
        estadios.value = data;
    } catch (err) {
        console.error('Error cargando estadios:', err);
        estadios.value = [];
    }
}

const abrirEdicion = () => {
    if (!equipo.value) return
    form.value = {
        nombre: equipo.value.nombre,
        siglas: equipo.value.siglas,
        lema: equipo.value.lema,
        color: equipo.value.color,
        claveAcceso: equipo.value.claveAcceso,
        estadio: equipo.value.estadio
    }
    editando.value = true
}

const cancelarEdicion = () => {
    editando.value = false
}

const actualizarEquipo = async () => {
    if (!props.equipoId) return
    await axios.put(
        `http://localhost:3000/equipos/${props.equipoId}`,
        form.value,
        { withCredentials: true }
    )
    editando.value = false
    fetchJugadores()
    emit('actualizar-rol') // Notificar al padre para refrescar el rol/capitanía
}

const salirEquipo = async () => {
    if (!props.equipoId) return
    // Si es el último miembro, pedir confirmación especial
    if (jugadores.value.length === 1) {
        // Consultar partidos conflictivos (puedes mejorar esto trayendo los partidos desde el backend)
        const res = await axios.get(`http://localhost:3000/equipos/${props.equipoId}/partidos-conflictivos`, { withCredentials: true });
        const conflictivos = res.data?.partidos || [];
        if (conflictivos.length > 0) {
            if (!confirm('Eres el último miembro. Se eliminarán todos los partidos pendientes/activos/asignados y el equipo. ¿Deseas continuar?')) return;
            // Llama al endpoint especial que borra partidos y equipo
            await axios.post(`http://localhost:3000/equipos/${props.equipoId}/salir-y-borrar`, {}, { withCredentials: true });
            window.location.reload();
            return;
        }
    }
    try {
        await axios.post(
            `http://localhost:3000/equipos/${props.equipoId}/salir`,
            {},
            { withCredentials: true }
        )
        emit('salio-equipo')
        emit('actualizar-rol') // Notificar al padre para refrescar el rol/capitanía
    } catch (err: any) {
        alert(err.response?.data?.message || 'No se pudo salir del equipo')
        await fetchJugadores() // Refresca el estado real del equipo tras error
    }
}


watch(() => props.equipoId, fetchJugadores)
onMounted(async () => {
    await Promise.all([fetchJugadores(), fetchEstadios(), fetchCurrentUser()]);
})
</script>

<style scoped>
@keyframes fade-in-up {
    0% {
        opacity: 0;
        transform: translateY(40px);
    }

    100% {
        opacity: 1;
        transform: translateY(0);
    }
}

.animate-fade-in-up {
    animation: fade-in-up 0.7s cubic-bezier(0.22, 1, 0.36, 1);
}
</style>