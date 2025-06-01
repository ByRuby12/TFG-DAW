<template>
    <div class="mx-auto p-4 sm:p-8 bg-white rounded-2xl shadow-lg">
        <h2 class="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-4 sm:mb-8">Estadísticas de Jugadores</h2>
        <div class="space-y-6">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label for="search" class="block text-sm font-medium text-gray-600">Buscar Jugador</label>
                    <input type="text" id="search" v-model="searchQuery" placeholder="Buscar por Usuario"
                        class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                </div>
                <div>
                    <label for="postalCode" class="block text-sm font-medium text-gray-600">Código Postal</label>
                    <input type="text" id="postalCode" v-model="filters.postalCode" placeholder="Código Postal"
                        class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                </div>
                <div>
                    <label for="position" class="block text-sm font-medium text-gray-600">Posición</label>
                    <select v-model="filters.position" id="position"
                        class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                        <option value="">Todas</option>
                        <option value="delantero">Delantero</option>
                        <option value="defensa">Defensa</option>
                        <option value="portero">Portero</option>
                        <option value="centrocampista">Centrocampista</option>
                    </select>
                </div>
            </div>
        </div>
        <div class="mt-6 space-y-6">
            <div class="hidden sm:block">
                <table class="min-w-full table-auto bg-white rounded-lg shadow-md">
                    <thead>
                        <tr class="bg-indigo-600 text-white">
                            <th class="py-2 px-4 text-left">Foto</th>
                            <th class="py-2 px-4 text-left">Usuario</th>
                            <th class="py-2 px-4 text-left">Correo</th>
                            <th class="py-2 px-4 text-left">Municipio</th>
                            <th class="py-2 px-4 text-left">Código Postal</th>
                            <th class="py-2 px-4 text-left">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="player in paginatedPlayers" :key="player.id" class="border-b hover:bg-gray-50">
                            <td class="py-2 px-4">
                                <img :src="player.fotoPerfil" alt="Foto de perfil"
                                    class="w-12 h-12 rounded-full object-cover">
                            </td>
                            <td class="py-2 px-4">{{ player.usuario }}</td>
                            <td class="py-2 px-4">{{ player.correo }}</td>
                            <td class="py-2 px-4">{{ player.city }}</td>
                            <td class="py-2 px-4">{{ player.postalCode }}</td>
                            <td class="py-2 px-4">
                                <button @click="viewPlayerDetails(player)"
                                    class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-300">
                                    Ver Detalles
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="sm:hidden space-y-4">
                <div v-for="player in paginatedPlayers" :key="player.id" class="border rounded-lg shadow-md p-4">
                    <div class="flex items-center space-x-4 mb-2">
                        <h3 class="text-lg font-semibold">{{ player.usuario }}</h3>
                    </div>
                    <p class="text-sm"><strong>Municipio: </strong>{{ player.city }}</p>
                    <p class="text-sm"><strong>Código Postal: </strong>{{ player.postalCode }}</p>
                    <p class="text-sm break-all"><strong>Email: </strong>{{ player.correo }}</p>
                    <button @click="viewPlayerDetails(player)"
                        class="mt-3 w-full py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition">
                        Ver Detalles
                    </button>
                </div>
            </div>
            <div class="flex justify-center space-x-2 mt-4 sm:mt-6" v-if="totalPages > 1">
                <button @click="prevPage" :disabled="currentPage === 1"
                    class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 transition duration-300">
                    Anterior
                </button>
                <span class="text-lg font-semibold text-gray-800">{{ currentPage }} / {{ totalPages }}</span>
                <button @click="nextPage" :disabled="currentPage === totalPages"
                    class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 transition duration-300">
                    Siguiente
                </button>
            </div>
        </div>
        <div v-if="selectedPlayer"
            class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center px-4">
            <div
                class="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-8 transition-all duration-300 space-y-6">
                <div class="text-center">
                    <h3 class="text-3xl font-bold text-gray-800"> {{ selectedPlayer.usuario }}</h3>
                    <p class="text-gray-500 text-sm mt-1">Jugador del <strong> '{{ selectedPlayer.equipo }}'</strong>
                    </p>
                </div>
                <div class="flex items-center space-x-6">
                    <div class="space-y-1">
                        <p class="text-gray-600"><strong>Tipo Usuario:</strong> {{ selectedPlayer.rol }}</p>
                        <p class="text-gray-600"><strong>Correo:</strong> {{ selectedPlayer.correo }}</p>
                        <p class="text-gray-600"><strong>Municipio:</strong> {{ selectedPlayer.city }}</p>
                        <p class="text-gray-600"><strong>Código Postal:</strong> {{ selectedPlayer.postalCode }}</p>
                        <p class="text-gray-600"><strong>Pie dominante:</strong> {{ selectedPlayer.piernaBuena ||
                            'Desconocido' }}</p>
                        <p class="text-gray-600"><strong>Posición:</strong> {{ selectedPlayer.position }}</p>
                    </div>
                </div>
                <h4 class="text-lg font-bold text-gray-800 mb-3">📊 Estadísticas</h4>
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                    <div class="bg-gray-100 p-3 rounded-xl shadow-sm">
                        <p class="text-2xl font-semibold text-blue-600">{{ selectedPlayer.partidosJugados ?? 0 }}</p>
                        <p class="text-sm text-gray-500 mt-1">Partidos</p>
                    </div>
                    <div class="bg-gray-100 p-3 rounded-xl shadow-sm">
                        <p class="text-2xl font-semibold text-green-600">{{ selectedPlayer.goles ?? 0 }}</p>
                        <p class="text-sm text-gray-500 mt-1">Goles</p>
                    </div>
                    <div class="bg-gray-100 p-3 rounded-xl shadow-sm">
                        <p class="text-2xl font-semibold text-yellow-500">{{ selectedPlayer.tarjetasAmarillas ?? 0 }}
                        </p>
                        <p class="text-sm text-gray-500 mt-1">Amarillas</p>
                    </div>
                    <div class="bg-gray-100 p-3 rounded-xl shadow-sm">
                        <p class="text-2xl font-semibold text-red-500">{{ selectedPlayer.tarjetasRojas ?? 0 }}</p>
                        <p class="text-sm text-gray-500 mt-1">Rojas</p>
                    </div>
                </div>
                <div class="flex justify-center mt-6">
                    <button @click="selectedPlayer = null"
                        class="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300 shadow-md">
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue';
import axios from 'axios';

interface Player {
    id: number
    fotoPerfil: string
    usuario: string
    equipo: string
    correo: string
    city: string
    postalCode: string
    rol: 'jugador' | 'arbitro' | 'administrador'
    position: 'portero' | 'defensa' | 'centrocampista' | 'delantero'
    piernaBuena?: string
    partidosJugados?: number
    goles?: number
    tarjetasAmarillas?: number
    tarjetasRojas?: number
}
const searchQuery = ref('')
const filters = reactive({ postalCode: '', position: '' })
const players = ref<Player[]>([])
const selectedPlayer = ref<Player | null>(null)
const itemsPerPage = 5
const currentPage = ref(1)
const totalPages = computed(() => Math.ceil(filteredPlayers.value.length / itemsPerPage))
const paginatedPlayers = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage
    return filteredPlayers.value.slice(start, start + itemsPerPage)
})

onMounted(async () => {
    try {
        const { data } = await axios.get<Player[]>('http://localhost:3000/jugadores/estadisticas', { withCredentials: true })
        console.log('RESPUESTA ESTADÍSTICAS:', data);
        players.value = data
    } catch (e) {
        console.error('Error cargando jugadores:', e)
    }
})

const filteredPlayers = computed(() =>
    players.value.filter(p =>
        (!searchQuery.value || p.usuario.toLocaleLowerCase().includes(searchQuery.value.toLocaleLowerCase())) &&
        (!filters.postalCode || p.postalCode.includes(filters.postalCode)) &&
        (!filters.position || p.position === filters.position)
    )
)

const prevPage = () => {
    if (currentPage.value > 1) currentPage.value--
}
const nextPage = () => {
    if (currentPage.value < totalPages.value) currentPage.value++
}
const viewPlayerDetails = (p: Player) => {
    selectedPlayer.value = p
}

watch(selectedPlayer, (p) => {
    if (p) console.log('Jugador seleccionado:', p)
})
watch(() => filters.position, (newVal) => {
    console.log('Filtro de posición seleccionado:', newVal)
})
watch(filteredPlayers, () => { currentPage.value = 1 })
</script>

<style scoped></style>