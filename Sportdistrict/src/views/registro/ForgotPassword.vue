<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-r from-yellow-500 to-orange-600">
    <div
      class="w-full max-w-lg p-12 space-y-8 bg-white rounded-2xl shadow-xl transform transition-all duration-500 hover:scale-105">
      <h2 class="text-4xl font-bold text-center text-gray-800">
        Olvidé mi contraseña
      </h2>
      <div>
        <label for="email" class="block text-sm font-medium text-gray-600">
          Correo electrónico
        </label>
        <input v-model="correo" type="email" placeholder="Introduce tu correo para recuperar tu contraseña"
            class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition duration-300" 
             />
      </div>
      <div class="flex flex-col space-y-4">
        <button @click="enviarCodigo"
          class="w-full py-3 px-4 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition duration-300 ease-in-out transform hover:scale-105">
          Enviar enlace de recuperación
        </button>
      </div>
      <p v-if="mensaje" class="mt-2 text-center text-green-600">{{ mensaje }}</p>
      <p @click="$emit('volver-login')" class="text-center text-sm text-gray-600">
        ¿Recuperaste tu contraseña? <span class="text-indigo-600 hover:text-indigo-800">Volver al login</span>
      </p>
    </div>
    <div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import axios from 'axios'
import ComponenteDiv from '@/components/ComponenteDiv.vue'
import ComponenteH2 from '@/components/ComponenteH2.vue'
import ComponenteInput from '@/components/ComponenteInput.vue'
import ComponenteParrafo from '@/components/ComponenteParrafo.vue'

const correo = ref('')
const mensaje = ref('')

const enviarCodigo = async () => {
  try {
    await axios.post('http://localhost:3000/usuarios/enviar-codigo', { correo: correo.value })
    mensaje.value = 'Se ha enviado un código a tu correo.'
    setTimeout(() => {
      emit('codigo-enviado', correo.value)
    }, 1500);
  } catch {
    mensaje.value = 'Error al enviar el código.'
  }
}

const emit = defineEmits(['codigo-enviado', 'volver-login'])
</script>

<style scoped></style>