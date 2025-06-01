<template>
  <div id="PanelRegister"
    class="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-500 to-pink-600">
    <div
      class="w-full max-w-lg p-12 space-y-8 bg-white rounded-2xl shadow-xl transform transition-all duration-500 hover:scale-105">
      <h2 class="text-4xl font-bold text-center text-gray-800">Registrarse</h2>
      <div>
        <label for="Nombreusu" class="block text-sm font-medium text-gray-600">
          Nombre de Usuario
        </label>
        <input type="text" v-model="Nombreusu"
          class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-300"
          placeholder="Introduce tu usuario" />
      </div>

      <ComponenteSmall v-if="Nombreusu && !nombreDisponible">
        Nombre de usuario no disponible
      </ComponenteSmall>
      <div>
        <label for="correo" class="block text-sm font-medium text-gray-600">
          Correo Electrónico
        </label>
        <input type="email" v-model="correo"
          class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-300"
          placeholder="Introduce tu correo electrónico" />
      </div>
      <ComponenteSmall v-if="correo && !correoDisponible">
        Correo ya registrado
      </ComponenteSmall>
      <div>
        <label for="contrasena" class="block text-sm font-medium text-gray-600">
          Contraseña
        </label>
        <input type="password" v-model="contrasena"
          class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-300"
          placeholder="Introduce tu contraseña" />
      </div>
      <div>
        <label for="confirmcontrasena" class="block text-sm font-medium text-gray-600">
          Confirmar contraseña
        </label>
        <input type="password" v-model="confirmcontrasena"
          class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-300"
          placeholder="Confirmar tu contraseña" />
      </div>
      <ComponenteH3 v-if="error">
        {{ error }}
      </ComponenteH3>
      <div class="flex flex-col space-y-4">
        <ComponenteBoton @click="registrar" id="btnRegistrar">
          Registrarse
        </ComponenteBoton>
      </div>
      <p @click="$emit('cambiar-panel')" id="cambiarLogin" class="text-center text-sm text-gray-600">
        ¿Ya tienes cuenta? <span class="text-indigo-600 hover:text-indigo-800">Inicia sesión aquí</span>
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineEmits, ref, watch, type Ref } from 'vue'
import axios from 'axios'
import debounce from 'lodash.debounce'
import ComponenteBoton from '@/components/ComponenteBoton.vue'
import ComponenteDiv from '@/components/ComponenteDiv.vue'
import ComponenteInput from '@/components/ComponenteInput.vue'
import ComponenteParrafo from '@/components/ComponenteParrafo.vue'
import ComponenteLabel from '@/components/ComponenteLabel.vue'
import ComponenteH3 from '@/components/ComponenteH3.vue'
import ComponenteSmall from '@/components/ComponenteSmall.vue'

const Nombreusu: Ref<string> = ref("")
const correo: Ref<string> = ref("")
const contrasena: Ref<string> = ref("")
const confirmcontrasena: Ref<string> = ref("")
let error: Ref<string> = ref("")
const nombreDisponible = ref(true)
const correoDisponible = ref(true)

const emit = defineEmits(['cambiar-panel'])

const comprobarNombre = debounce(async () => {
  if (!Nombreusu.value.trim()) return
  try {
    const res = await axios.get(`http://localhost:3000/usuarios/existe-nombre/${Nombreusu.value}`)
    nombreDisponible.value = !res.data.existe
  } catch {
    nombreDisponible.value = true
  }
}, 400)

const comprobarCorreo = debounce(async () => {
  if (!correo.value.trim()) return
  try {
    const res = await axios.get(`http://localhost:3000/usuarios/existe-correo/${correo.value}`)
    correoDisponible.value = !res.data.existe
  } catch (e) {
    console.error("Error al comprobar el correo:", e)
    correoDisponible.value = true
  }
}, 400)

watch(Nombreusu, comprobarNombre)
watch(correo, comprobarCorreo)

const validarFormulario = () => {
  if (!Nombreusu.value || !correo.value || !contrasena.value || !confirmcontrasena.value) {
    error.value = "Todos los campos son obligatorios"
    return false
  }
  const formatoEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!formatoEmail.test(correo.value)) {
    error.value = "Correo no válido"
    return false
  }

  if (contrasena.value.length < 6) {
    error.value = "La contraseña debe tener al menos 6 caracteres."
    return false
  }

  if (contrasena.value !== confirmcontrasena.value) {
    error.value = "Las contraseñas no coinciden"
    return false
  }

  if (!nombreDisponible.value) {
    error.value = "Nombre de usuario ya existe"
    return false
  }

  if (!correoDisponible.value) {
    error.value = "Correo ya está registrado"
    return false
  }
  return true
}

const registrar = async () => {
  if (!validarFormulario()) return
  try {
    const reponse = await axios.post('http://localhost:3000/usuarios/register', {
      Nombreusu: Nombreusu.value,
      correo: correo.value,
      contrasena: contrasena.value
    })

    if (reponse.data.success === false) {
      error.value = reponse.data.message || "Registro fallido"
      return
    }

    alert("Registro exitoso. Por favor verifica tu cuenta desde tu correo")
    error.value = ""
    emit('cambiar-panel')

  } catch (err: any) {
    console.error(err)
    error.value = err.response?.data?.message || "Error al registrar el usuario"
  }
}

</script>

<style scoped>
.error {
  color: red;
}
</style>