<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-600">
    <div
      class="w-full max-w-lg p-12 space-y-8 bg-white rounded-2xl shadow-xl transform transition-all duration-500 hover:scale-105">
      <h2 class="text-4xl font-bold text-center text-gray-800">Restablecer contraseña</h2>
      <div>
        <label class="block text-sm font-medium text-gray-600">Nueva contraseña</label>
        <input v-model="password" :disabled="loading" type="password" placeholder="Introduce tu nueva contraseña"
          class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-300" />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-600">Repetir contraseña</label>
        <input v-model="confirmarPassword" :disabled="loading" type="password"
          placeholder="Confirma tu nueva contraseña" minlength="6"
          class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-300" />
      </div>
      <div class="flex flex-col space-y-4">
        <button @click="cambiarContrasena" :disabled="loading"
          class="w-full py-3 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-300 ease-in-out transform hover:scale-105">
          Confirmar contraseña
        </button>
      </div>
      <p v-if="mensaje" class="mt-2 text-center text-green-600">{{ mensaje }}</p>
      <ComponenteH3 v-if="error" class="text-red-500 text-center mb-2">
        {{ error }}
      </ComponenteH3>
      <p @click="$emit('volver-login')" class="text-center text-sm text-gray-600">
        ¿Recuperaste la contraseña? <span class="text-indigo-600 hover:text-indigo-800">Iniciar de sesión</span>
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import axios from 'axios'
import { defineProps, defineEmits } from 'vue';
import ComponenteDiv from '@/components/ComponenteDiv.vue';
import ComponenteH2 from '@/components/ComponenteH2.vue';
import ComponenteInput from '@/components/ComponenteInput.vue';
import ComponenteH3 from '@/components/ComponenteH3.vue';
import ComponenteParrafo from '@/components/ComponenteParrafo.vue';

const props = defineProps<{ correo: string }>()
const emit = defineEmits(['volver-login'])
const password = ref('')
const confirmarPassword = ref('')
const mensaje = ref('')
const error = ref('')
const mostrarVolver = ref(false)
const loading = ref(false)

const cambiarContrasena = async () => {
  if (password.value !== confirmarPassword.value) {
    error.value = 'Las contraseñas no coinciden.'
    return
  }
  loading.value = true
  try {
    await axios.post('http://localhost:3000/usuarios/cambiar-contrasena', {
      correo: props.correo,
      nuevaContrasena: password.value
    })
    mensaje.value = 'Contraseña actualizada correctamente.'
    error.value = ''
    mostrarVolver.value = true
  } catch {
    error.value = 'Error al cambiar la contraseña.'
  } finally {
    loading.value = false
  }
}

</script>

<style scoped></style>