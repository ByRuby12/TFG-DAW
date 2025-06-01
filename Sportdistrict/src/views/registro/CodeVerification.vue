<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-600">
    <div
      class="w-full max-w-lg p-12 space-y-8 bg-white rounded-2xl shadow-xl transform transition-all duration-500 hover:scale-105">
      <h2 class="text-4xl font-bold text-center text-gray-800">
        Verifica tu código
      </h2>
      <div>
        <label class="block text-sm font-medium text-gray-600">Código de verificación</label>
        <input v-model="codigo" type="text" placeholder="Introduce el código que recibiste por correo"
          class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-300" />
      </div>
      <div class="flex flex-col space-y-4">
        <button @click="verificarCodigo"
          class="w-full py-3 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-300 ease-in-out transform hover:scale-105">
          Verificar
        </button>
      </div>
      <ComponenteH3 v-if="mensaje">
        {{ mensaje }}
      </ComponenteH3>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import axios from 'axios';
import ComponenteDiv from '@/components/ComponenteDiv.vue';
import ComponenteInput from '@/components/ComponenteInput.vue';
import ComponenteBoton from '@/components/ComponenteBoton.vue';
import ComponenteH3 from '@/components/ComponenteH3.vue';
import ComponenteH2 from '@/components/ComponenteH2.vue';

const props = defineProps<{ correo: string }>()
const emit = defineEmits(['codigo-verificado'])

const codigo = ref('')
const mensaje = ref('')

const verificarCodigo = async () => {
  try {
    await axios.post('http://localhost:3000/usuarios/verificar-codigo', { correo: props.correo, codigo: codigo.value })
    emit('codigo-verificado', props.correo)
  } catch {
    mensaje.value = 'Código incorrecto.'
  }
}
</script>

<style scoped></style>