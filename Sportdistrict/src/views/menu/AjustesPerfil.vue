<template>
    <div class="min-h-screen from-blue-500 to-purple-600 flex items-center justify-center">
        <div class="w-full p-8 bg-white rounded-2xl shadow-xl">
            <h2 class="text-3xl font-bold text-center text-gray-800 mb-8">Ajustes de Usuario</h2>
            <form @submit.prevent="handleUpdate" class="space-y-8">
                <div class="flex flex-col items-center">
                    <div v-if="selectedAvatar" class="mb-4">
                        <img :src="selectedAvatar" alt="Foto de perfil"
                            class="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-indigo-600 shadow-md object-cover">
                    </div>
                    <button type="button" @click="showModal = true"
                        class="px-4 py-2 bg-indigo-600 text-white rounded-md mb-4 shadow hover:bg-indigo-700 transition">
                        Elegir avatar
                    </button>
                    <div v-if="showModal"
                        class="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
                        <div class="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-md">
                            <h3 class="text-lg font-semibold text-center mb-4">Elige tu avatar</h3>
                            <div class="flex flex-wrap justify-center gap-4">
                                <div v-for="(avatar, idx) in avatars" :key="idx"
                                    @click="() => seleccionarAvatar(avatar)"
                                    :class="['w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden cursor-pointer transition-transform hover:scale-110',
                                        selectedAvatar === avatar ? 'border-4 border-indigo-600' : 'border-2 border-gray-300']">
                                    <img :src="avatar" alt="Foto de perfil" class="w-full h-full object-cover">
                                </div>
                            </div>
                            <div class="mt-6 text-center">
                                <button @click="showModal = false" class="px-4 py-2 bg-gray-300 text-black rounded-md hover:bg-gray-400 transition">
                                    Cerrar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-600">Nombre</label>
                        <input v-model="nombre" type="text"
                            class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50"
                            placeholder="Introduce tu nombre" />
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-600">Primer apellido</label>
                        <input v-model="primer_apellido" type="text"
                            class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50"
                            placeholder="Introduce tu primer apellido" />
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-600">Segundo apellido</label>
                        <input v-model="segundo_apellido" type="text"
                            class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50"
                            placeholder="Introduce tu segundo apellido" />
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-600">Fecha de Nacimiento</label>
                        <input v-model="fechaNac" type="date"
                            class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50"/>
                    </div>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-600">Sexo</label>
                        <select v-model="sexo"
                            class="w-full px-1 py-3 border-2 border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50">
                            <option value="mujer">Mujer</option>
                            <option value="hombre">Hombre</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-600">Peso (kg)</label>
                        <input v-model="peso" type="number"
                            class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50"
                            placeholder="Introduce tu peso" />
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-600">Altura (cm)</label>
                        <input v-model="altura" type="number"
                            class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50"
                            placeholder="Introduce tu altura" />
                    </div>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-600">Correo Electrónico</label>
                    <input v-model="correo" type="email"
                        class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50"
                        placeholder="Introduce tu correo electrónico" />
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-600">Número Camiseta</label>
                        <input v-model="num_camiseta" type="number"
                            class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50"
                            placeholder="Introduce tu número de camiseta" />
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-600">Municipio</label>
                        <input v-model="city" type="text"
                            class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50"
                            placeholder="Introduce tu municipio" />
                    </div>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-600">Dirección</label>
                        <input v-model="direccion" type="text"
                            class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50"
                            placeholder="Introduce tu dirección" />
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-600">Código Postal</label>
                        <input v-model="codigoPostal" type="text" maxlength="5"
                            class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50"
                            placeholder="Introduce tu código postal" />
                    </div>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-600">Pierna Dominante</label>
                        <select v-model="piernaBuena"
                            class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50">
                            <option value="diestro">Diestro</option>
                            <option value="zurdo">Zurdo</option>
                            <option value="ambidiestro">Ambidiestro</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-600">Posición</label>
                        <select v-model="position"
                            class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50">
                            <option value="delantero">Delantero</option>
                            <option value="centrocampista">Centrocampista</option>
                            <option value="defensa">Defensa</option>
                            <option value="portero">Portero</option>
                        </select>
                    </div>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-600">Biografía (max 150 caracteres)</label>
                    <textarea v-model="biografia" maxlength="150"
                        class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 resize-none"
                        placeholder="Escribe una breve biografía"></textarea>
                </div>
                <div class="flex flex-col md:flex-row gap-4 mt-4">
                    <button type="submit" class="flex-1 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-md transition">
                        Guardar cambios
                    </button>
                    <button type="button" @click="handleLogout"
                        class="flex-1 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 shadow-md transition">
                        Cerrar sesión
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, defineEmits } from 'vue';
import axios from 'axios';

const avatarFiles = import.meta.glob('../../assets/avatars/imagen*.png', { eager: true })
const avatars = Object.values(avatarFiles).map((m: any) => m.default)

const showModal = ref(false)
const selectedAvatar = ref<string | null>(null)

const nombre = ref('')
const primer_apellido = ref('')
const segundo_apellido = ref('')
const sexo = ref<'hombre' | 'mujer'>('hombre')
const peso = ref<number | null>(null)
const altura = ref<number | null>(null)
const fechaNac = ref('')
const correo = ref('')
const num_camiseta = ref<number | null>(null)
const city = ref('')
const direccion = ref('')
const codigoPostal = ref('')
const piernaBuena = ref<'diestro' | 'zurdo' | 'ambidiestro'>('diestro')
const position = ref<'delantero' | 'centrocampista' | 'defensa' | 'portero'>('portero')
const biografia = ref('')
const userId = ref<number | null>(null)
const emit = defineEmits<{
    (e: 'avatar-changed', payload: string): void
    (e: 'volver-menu'): void
}>()



onMounted(async () => {
    try {
        const { data } = await axios.get('http://localhost:3000/usuarios/usuario-actual', { withCredentials: true })
        if (!data.success) throw new Error()
        const u = data
        userId.value = u.id
        nombre.value = u.persona.nombre
        primer_apellido.value = u.persona.primer_apellido
        segundo_apellido.value = u.persona.segundo_apellido
        sexo.value = u.persona.sexo
        peso.value = u.persona.peso
        altura.value = u.persona.altura
        fechaNac.value = u.persona.fechaNac.split('T')[0]
        city.value = u.persona.municipio
        direccion.value = u.persona.direccion
        codigoPostal.value = u.persona.codigoPostal || ''
        biografia.value = u.persona.biografia
        num_camiseta.value = u.jugador.numCamiseta
        piernaBuena.value = u.jugador.piernaBuena
        position.value = u.jugador.posicion
        correo.value = u.correo
        if (u.foto) selectedAvatar.value = u.foto
    } catch {
        console.error('No autenticado')
        emit('volver-menu')
    }
})

const seleccionarAvatar = (avatar: string) => {
    selectedAvatar.value = avatar
    showModal.value = false
}

const handleUpdate = async () => {
    if (!userId.value) return
    try {
        if (selectedAvatar.value && !selectedAvatar.value.startsWith('http')) {
            const { data: fotoRes } = await axios.put(
                `http://localhost:3000/usuarios/${userId.value}/foto`,
                { foto: selectedAvatar.value },
                { withCredentials: true }
            );
            emit('avatar-changed', fotoRes.urlFoto)
        }
        await axios.post(`http://localhost:3000/usuarios/${userId.value}/perfil`, {
            persona: {
                nombre: nombre.value,
                primer_apellido: primer_apellido.value,
                segundo_apellido: segundo_apellido.value,
                sexo: sexo.value,
                peso: peso.value,
                altura: altura.value,
                fechaNac: fechaNac.value,
                municipio: city.value,
                direccion: direccion.value,
                biografia: biografia.value,
                codigoPostal: codigoPostal.value
            },
            jugador: {
                numCamiseta: num_camiseta.value,
                piernaBuena: piernaBuena.value,
                posicion: position.value
            }
        },
            { withCredentials: true })
        alert('Perfil actualizado correctamente.')
        window.location.reload() // Refrescar la web tras guardar cambios
    } catch (err: any) {
        console.error(err)
        alert('Error al actualizar')
    }
}

const handleLogout = async () => {
    try {
        await axios.post('http://localhost:3000/usuarios/logout', {}, { withCredentials: true })
    } finally {
        window.location.href = '/login'
    }
}
</script>

<style scoped>
.bg-gradient-to-br {
  background: linear-gradient(135deg, #3b82f6 0%, #a78bfa 100%);
}
@media (max-width: 640px) {
  .max-w-2xl {
    border-radius: 1.25rem;
    padding: 1.25rem;
  }
  form {
    padding: 0;
  }
}
</style>