<template>
    <div class="mx-auto p-8 bg-white rounded-2xl shadow-lg">
        <h2 class="text-3xl font-bold text-center text-gray-800 mb-8">Crear un Equipo</h2>
        <div class="space-y-8">
            <div class="space-y-6">
                <form @submit.prevent="crearEquipo">
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <label class="block text-sm font-semibold text-gray-700">Nombre del equipo</label>
                            <input v-model="equipo.nombre" placeholder="Introduce el nombre del equipo"
                                class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-300">
                        </div>
                        <div>
                            <label class="block text-sm font-semibold text-gray-700">Siglas del equipo</label>
                            <input v-model="equipo.siglas" placeholder="Introduce las siglas del equipo" maxlength="3"
                                class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-300">
                        </div>
                    </div>
                    <div class="mt-4">
                        <label class="block text-sm font-semibold text-gray-700">Color del equipo</label>
                        <input v-model="equipo.color" type="color"
                            class="w-16 h-10 border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    </div>
                    <div class="mt-4">
                        <label class="block text-sm font-semibold text-gray-700 mb-1">Dirección del estadio</label>
                        <input v-model="equipo.estadio" list="estadios-list" placeholder="Buscar dirección..."
                            class="w-full border px-3 py-2 rounded-lg" required>
                        <datalist id="estadios-list"
                            class="absolute z-50 bg-white border w-full mt-1 max-h-40 overflow-auto rounded shadow">
                            <option v-for="(e, i) in estadios" :key="i" :value="e.direccion"
                                class="px-4 py-2 hover:bg-gray-200 cursor-pointer"></option>
                        </datalist>
                    </div>
                    <div class="mt-4">
                        <label class="block text-sm font-semibold text-gray-700">Lema del equipo</label>
                        <textarea v-model="equipo.lema"
                            class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Introduce el lema del equipo" minlength="5">> </textarea>
                    </div>
                    <div class="mt-4">
                        <label class="block text-sm font-semibold text-gray-700">Clave de acceso</label>
                        <input v-model="equipo.claveAcceso" placeholder="Clave de acceso"
                            class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            maxlength="4">
                    </div>
                    <div class="mt-6 flex justify-center">
                        <button type="submit"
                            class="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-300 ease-in-out">
                            Crear Equipo
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import axios from 'axios';

axios.defaults.withCredentials = true
const emit = defineEmits<{
    (e: 'equipo-creado', equipo: { id: number }): void
    (e: 'volver-menu'): void
}>()
const equipo = ref({
    nombre: '',
    siglas: '',
    lema: '',
    color: '#000000',
    claveAcceso: '',
    estadio: ''
})

const estadios = ref<{ direccion: string }[]>([])
const error = ref('')
const mensaje = ref('')
const crearEquipo = async () => {
    error.value = ''
    mensaje.value = ''
    if (!equipo.value.nombre.trim() || !equipo.value.siglas.trim() || !equipo.value.claveAcceso.trim() || !equipo.value.estadio.trim()) {
        error.value = 'Nombre, siglas y clave de acceso son obligatorios.'
        return
    }
    if (equipo.value.siglas.length > 3) {
        error.value = 'Las siglas no pueden exceder 3 caracteres.'
        return
    }

    try {
        const response = await axios.post('http://localhost:3000/equipos',
            { ...equipo.value },
            { withCredentials: true }
        )
        if (response.data.success) {
            emit('equipo-creado', response.data.equipo)
            mensaje.value = 'Equipo creado correctamente'
            equipo.value = {
                nombre: '',
                siglas: '',
                lema: '',
                color: '#000000',
                claveAcceso: '',
                estadio: ''
            }

        } else {
            error.value = response.data.message || 'Error al crear el equipo'
        }
    } catch (err: any) {
        error.value = err.response?.data?.message || 'Error de conexión'
    }
}

onMounted(async () => {
    try {
        const { data } = await axios.get<{ direccion: string }[]>('http://localhost:3000/estadios')
        estadios.value = data
    } catch {
        estadios.value = []
    }
})

</script>

<style scoped>
.crear-equipo {
    max-width: 500px;
    margin: auto;
    background-color: #fff8dc;
    padding: 20px;
    border-radius: 12px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.crear-equipo h2 {
    text-align: center;
    margin-bottom: 20px;
    color: #333;
}

.crear-equipo form>div {
    margin-bottom: 15px;
}

.crear-equipo label {
    display: block;
    font-weight: bold;
    margin-bottom: 5px;
    color: #555;
}

.crear-equipo input {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 8px;
    box-sizing: border-box;
}

.crear-equipo button {
    width: 100%;
    padding: 12px;
    background-color: #28a745;
    color: white;
    font-weight: bold;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background 0.3s ease;
}

.crear-equipo button:hover {
    background-color: #218838;
}
</style>