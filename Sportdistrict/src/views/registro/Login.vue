<template>
  <div v-if="!logued" id="PanelLogin"
    class="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-600">
    <div
      class="w-full max-w-lg p-12 space-y-8 bg-white rounded-2xl shadow-xl transform transition-all duration-500 hover:scale-105">
      <h2 class="text-4xl font-bold text-center text-gray-800">Iniciar sesión</h2>
      <div>
        <label for="Nombreusu" class="block text-sm font-medium text-gray-600">
          Usuario
        </label>
        <input type="text" v-model="Nombreusu"
          class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-300"
          placeholder="Introduce tu usuario" />
      </div>
      <div>
        <label for="contrasena" class="block text-sm font-medium text-gray-600">
          Contraseña
        </label>
        <div class="relative">
          <input :type="showPassword ? 'text' : 'password'" v-model="contrasena"
            class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-300 pr-12"
            placeholder="Introduce tu contraseña" />
          <span @click="showPassword = !showPassword"
            class="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500 hover:text-indigo-600 select-none">
            <svg v-if="showPassword" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.956 9.956 0 012.293-3.95m3.249-2.568A9.956 9.956 0 0112 5c4.478 0 8.268 2.943 9.542 7a9.973 9.973 0 01-4.043 5.306M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3l18 18" />
            </svg>
          </span>
        </div>
      </div>
      <div class="flex justify-between items-center">
        <p @click="$emit('mostrar-recuperacion')" class="text-sm text-indigo-600 hover:text-indigo-800">
          Olvidé mi contraseña
        </p>
      </div>
      <div class="flex flex-col space-y-2">
        <button @click="iniciarSesion"
          class="w-full py-3 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-300 ease-in-out transform hover:scale-105">
          Iniciar sesión
        </button>
        <button @click="iniciarSesionConGoogle"
          class="w-full py-3 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-300 ease-in-out transform hover:scale-105">
          Iniciar sesión con Google
        </button>
      </div>


      <ComponenteDiv v-if="confirmacionPendiente"
        class="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative mb-4">
        <ComponenteStrong>
          Atención:
        </ComponenteStrong>
        <ComponenteSpan>
          {{ confirmacionPendiente }}
        </ComponenteSpan>
      </ComponenteDiv>

      <p @click="$emit('cambiar-panel')" id="cambiarRegister" class="text-center text-sm text-gray-600">
        ¿No tienes cuenta? <span class="text-indigo-600 hover:text-indigo-800">Regístrate aquí</span>
      </p>
      <ComponenteH3 v-if="error">
        {{ error }}
      </ComponenteH3>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineEmits, ref, type Ref } from 'vue'
import axios from 'axios'
import ComponenteBoton from '@/components/ComponenteBoton.vue'
import ComponenteLabel from '@/components/ComponenteLabel.vue'
import ComponenteInput from '@/components/ComponenteInput.vue'
import ComponenteParrafo from '@/components/ComponenteParrafo.vue'
import ComponenteDiv from '@/components/ComponenteDiv.vue'
import ComponenteH3 from '@/components/ComponenteH3.vue'
import ComponenteStrong from '@/components/ComponenteStrong.vue'
import ComponenteSpan from '@/components/ComponenteSpan.vue'

const emit = defineEmits(['cambiar-panel', 'loguear', 'mostrar-recuperacion'])

const Nombreusu: Ref<string> = ref("")
const contrasena: Ref<string> = ref("")
const confirmacionPendiente = ref("")
let error = ref("")
const logued = ref(false)
const showPassword = ref(false)

const validarLogin = () => {
  if (!Nombreusu.value || !contrasena.value) {
    error.value = "Todos los campos son obligatorios"
    return false
  }
  return true
}

const iniciarSesion = async () => {
  if (!validarLogin()) return
  try {
    const response = await axios.post('http://localhost:3000/usuarios/login', {
      Nombreusu: Nombreusu.value,
      contrasena: contrasena.value
    }, {
      withCredentials: true
    })

    if (response.data.success) {
      emit('loguear', 'ok')
      localStorage.setItem('nombreusu', Nombreusu.value)
    } else {
      if (response.data.message === "Debes confirmar tu cuenta antes de iniciar sesión.") {
        emit('loguear', 'no confirmado')
      } else {
        error.value = response.data.message
      }

    }
  } catch (msgerror) {
    error.value = "Error al conectar con el servidor"
  }
}

const iniciarSesionConGoogle = () => {
  window.location.href = 'http://localhost:3000/auth/google'
}
</script>

<style>
p {
  cursor: pointer;
}
</style>