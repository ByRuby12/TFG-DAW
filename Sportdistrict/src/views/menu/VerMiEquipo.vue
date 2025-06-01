<template>
    <div class="mx-auto p-8 bg-white rounded-2xl shadow-lg">
        <div class="mt-8">
            <h2 v-if="equipo" class="text-3xl font-semibold text-indigo-700 mb-6 text-center">Nombre del Equipo: {{
                equipo.nombre }}</h2>
            <div v-if="equipo" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div class="mb-6  grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <p class="text-lg font-medium text-gray-600"><strong>Siglas: </strong><span
                            class="font-semibold text-indigo-600">{{ equipo.siglas }}</span></p>
                    <p class="text-lg font-medium text-gray-600"><strong>Lema: </strong><span
                            class="font-semibold text-indigo-600">{{ equipo.lema }}</span></p>
                    <p class="text-lg font-medium text-gray-600"><strong>Estadio: </strong><span
                            class="font-semibold text-indigo-600">{{ equipo.estadio }}</span></p>
                </div>
            </div>
            <div v-if="equipo" class="mb-6">
                <h3 class="text-2xl font-semibold text-indigo-700 mb-4">Jugadores</h3>
                <ul class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    <li v-for="j in jugadores" :key="j.id"
                        class="bg-indigo-50 p-4 rounded-lg shadow-sm flex items-center">
                        <div
                            class="flex-shrink-0 w-12 h-12 bg-indigo-300 text-white rounded-full flex items-center justify-center font-bold text-lg">
                            {{ j.Nombreusu.charAt(0) }}
                        </div>
                        <div class="ml-4">
                            <p class="text-indigo-600 font-semibold">{{ j.Nombreusu }}</p>
                            <p class="text-gray-700">{{ j.persona.nombre }} {{ j.persona.primer_apellido }} <span v-if="j.persona.segundo_apellido">
                            {{ j.persona.segundo_apellido }}
                          </span>
                        </p>
                        <p class="text-sm text-gray-500">Posición: {{ j.posicion }}</p>
                        <p class="text-sm text-gray-500">Pie dominante: {{ j.piernaBuena }}</p>
                        </div>
                    </li>
                </ul>
            </div>
            <div v-if="equipo" class="space-y-4">
                <h3 class="text-2xl font-semibold text-indigo-700 mb-4">Estadísticas</h3>
                <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                    <div class="bg-indigo-50 p-4 rounded-lg shadow-sm text-center">
                        <p class="text-xl font-semibold text-indigo-600">{{ stats.ganados }}</p>
                        <p class="text-sm text-gray-500">Ganados</p>
                    </div>
                    <div class="bg-indigo-50 p-4 rounded-lg shadow-sm text-center">
                        <p class="text-xl font-semibold text-indigo-600">{{ stats.perdidos }}</p>
                        <p class="text-sm text-gray-500">Perdidos</p>
                    </div>
                    <div class="bg-indigo-50 p-4 rounded-lg shadow-sm text-center">
                        <p class="text-xl font-semibold text-indigo-600">{{ stats.jugados }}</p>
                        <p class="text-sm text-gray-500">Jugados</p>
                    </div>
                    <div class="bg-indigo-50 p-4 rounded-lg shadow-sm text-center">
                        <p class="text-xl font-semibold text-indigo-600">{{ stats.golesTotales }}</p>
                        <p class="text-sm text-gray-500">Goles</p>
                    </div>
                </div>
            </div>
            <div class="flex flex-wrap justify-center gap-4 mt-6">
                <button v-if="isCapitan" @click="abrirEdicion"
                    class="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition w-full sm:w-auto">
                    Editar equipo
                </button>
                <button v-if="isMiembro" @click="salirEquipo"
                    class="px-6 py-2 bg-yellow-500 text-white font-semibold rounded-lg shadow-md hover:bg-yellow-600 transition w-full sm:w-auto">
                    Salir del equipo
                </button>
            </div>
            <div v-if="editando" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                <div class="bg-white p-6 rounded-2xl shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto space-y-6">
                    <h3 class="text-2xl font-semibold text-gray-800">Editar equipo</h3>
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
}

const salirEquipo = async () => {
    if (!props.equipoId) return
    await axios.post(
        `http://localhost:3000/equipos/${props.equipoId}/salir`,
        {},
        { withCredentials: true }
    )
    emit('salio-equipo')
}


watch(() => props.equipoId, fetchJugadores)
onMounted(async () => {
    await Promise.all([fetchJugadores(), fetchEstadios(), fetchCurrentUser()]);
})
</script>

<style scoped></style>