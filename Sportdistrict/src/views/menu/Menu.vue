<template>
  <div class="h-screen flex flex-col md:flex-row bg-gradient-to-r from-blue-500 to-purple-600 text-gray-800 relative">
    <transition name="slide">
      <aside v-if="isSidebarOpen || isDesktop" :class="['fixed md:static inset-0 md:inset-y-0 md:left-0 z-40 bg-white shadow-2xl transition-all duration-300 ease-in-out',
        isDesktop ? (isMenuCollapsed ? 'md:w-24' : 'md:w-72') : 'w-full',
        'flex flex-col'
      ]">

        <!-- Botón y texto en móvil -->
        <div class="md:hidden flex justify-between items-center p-4 border-b border-gray-200">
          <!-- Texto a la izquierda -->
          <p class="text-lg font-semibold text-gray-800">Deportistas del Barrio</p>
          <!-- Botón cerrar a la derecha -->
          <button @click="isSidebarOpen = false"
            class="text-3xl text-gray-700 hover:text-red-500 transition transform hover:scale-110">
            ✕
          </button>
        </div>

        <div class="hidden md:flex relative p-4 border-b border-gray-200"
          :class="isMenuCollapsed ? 'justify-center' : 'justify-between items-center'">
          <button v-if="isDesktop" @click="toggleMenu"
            class="text-2xl text-gray-600 hover:text-purple-500 transition transform hover:scale-110">
            ☰
          </button>
          <p v-if="!isMenuCollapsed" class="text-lg font-semibold text-gray-800 flex-1 text-center">
            Deportistas del Barrio
          </p>
        </div>
        <div class="p-4 flex flex-col items-center border-b border-gray-200">
          <img :src="props.userAvatar" alt="Foto de perfil"
            class="rounded-full border-4 border-purple-500 shadow-md transition-all duration-300"
            :class="isMenuCollapsed ? 'w-12 h-12' : 'w-24 h-24'" />
          <p v-if="!isMenuCollapsed" class="mt-2 text-xl font-semibold text-gray-800">
            @{{ username }}
          </p>
        </div>
        <div v-if="props.avisoPerfil && !isMenuCollapsed"
          class="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4 mx-2 rounded">
          ⚠️ Por favor, completa tu perfil en el panel de perfil para poder continuar.
        </div>
        <div v-if="!isMenuCollapsed" class="p-4 border-b border-gray-200">
          <input v-model="searchQuery" placeholder="Buscar..." type="text"
            class="w-full p-2 text-gray-800 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500">
        </div>
        <nav class="flex-1 px-2 py-4 space-y-2 overflow-y-auto flex flex-col items-center">
          <template v-if="props.isAdmin">
            <button v-if="!searchQuery || matches('Inicio')" @click="navigate('ver-inicio')"
              :class="btnClass('ver-inicio')">
              🏠<span v-if="!isMenuCollapsed" class="ml-3">Inicio</span>
            </button>
            <button v-if="!searchQuery || matches('Estadios')" @click="navigate('ver-estadios')"
              :class="btnClass('ver-estadios')">
              🗺️<span v-if="!isMenuCollapsed" class="ml-3">Estadios de Fútbol</span>
            </button>
            <button v-if="!searchQuery || matches('Admin')" @click="navigate('ver-admin')"
              :class="btnClass('ver-admin')">
              🛠️<span v-if="!isMenuCollapsed" class="ml-3">Panel Admin</span>
            </button>
            <button v-if="!searchQuery || matches('Reportes')" @click="navigate('ver-reportesAdmin')"
              :class="btnClass('ver-reportesAdmin')">
              🔰<span v-if="!isMenuCollapsed" class="ml-3">Panel Reportes</span>
            </button>
          </template>
          <template v-else>
            <button v-if="!searchQuery || matches('Inicio')" @click="navigate('ver-inicio')"
              :class="btnClass('ver-inicio')">
              🏠<span v-if="!isMenuCollapsed" class="ml-3">Inicio</span>
            </button>
            <button v-if="!searchQuery || matches('Estadios')" @click="navigate('ver-estadios')"
              :class="btnClass('ver-estadios')">
              🏟️<span v-if="!isMenuCollapsed" class="ml-3">Estadios de Fútbol</span>
            </button>
            <button v-if="hasEquipo && !props.isArbitro && (!searchQuery || matches('Ver mi equipo'))"
              @click="navigate('ver-mi-equipo')" :class="btnClass('ver-mi-equipo')">
              <span>👥</span>
              <span v-if="!isMenuCollapsed" class="ml-3">Mi Equipo</span>
            </button>
            <button v-if="hasEquipo && isCaptain && !props.isArbitro && (!searchQuery || matches('Partidos'))"
              @click="navigate('ver-partidos')" :class="btnClass('ver-partidos')">
              <span>⚽</span>
              <span v-if="!isMenuCollapsed" class="ml-3">Partidos</span>
            </button>
            <button v-if="props.isArbitro && (!searchQuery || matches('Panel Árbitro'))"
              @click="navigate('panel-arbitro')" :class="btnClass('panel-arbitro')">
              📅<span v-if="!isMenuCollapsed" class="ml-3">Panel Árbitro</span>
            </button>
            <button v-if="!searchQuery || matches('Estadísticas')" @click="navigate('ver-estadisticas')"
              :class="btnClass('ver-estadisticas')">
              📊<span v-if="!isMenuCollapsed" class="ml-3">Estadísticas</span>
            </button>
            <button v-if="!searchQuery || matches('Reportes')" @click="navigate('ver-reportes')"
              :class="btnClass('ver-reportes')">
              📝<span v-if="!isMenuCollapsed" class="ml-3">Reportes</span>
            </button>
            <!-- Solo mostrar crear equipo/inscribirse si NO tiene equipo -->
            <template v-if="!hasEquipo && !props.isArbitro">
              <button v-if="!searchQuery || matches('Crear equipo')"
                @click="navigate('crear-equipo')" :disabled="avisoPerfil"
                :class="btnClass('crear-equipo', avisoPerfil)">
                <span>➕</span>
                <span v-if="!isMenuCollapsed" class="ml-3">Crear un Equipo</span>
              </button>
              <button v-if="!searchQuery || matches('Inscribirse')"
                @click="navigate('unirse-equipo')" :disabled="avisoPerfil"
                :class="btnClass('unirse-equipo', avisoPerfil)">
                <span>✋</span>
                <span v-if="!isMenuCollapsed" class="ml-3"> Unirse a un Equipo</span>
              </button>
            </template>
          </template>
        </nav>
        <div class="px-2 py-4 border-t border-gray-200 flex flex-col items-center space-y-2">
          <button @click="navigate('ver-perfil')" :class="btnClass('ver-perfil')">
            <span>👤</span>
            <span v-if="!isMenuCollapsed" class="ml-3">Perfil</span>
          </button>
          <button @click="navigate('ver-ajustes')" :class="btnClass('ver-ajustes')">
            ⚙️<span v-if="!isMenuCollapsed" class="ml-3">Ajustes</span>
          </button>
          <button
            class="w-full flex items-center px-4 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition duration-300 hover:scale-105"
            :class="isMenuCollapsed ? 'justify-center' : ''" @click="cerrarSesion">
            <span>🔒</span>
            <span v-if="!isMenuCollapsed" class="ml-3">Cerrar Sesión</span>
          </button>
        </div>
      </aside>
    </transition>
    <main class="flex-1 overflow-y-auto p-4 md:pb-24 pb-32 transition-all duration-300">
      <!-- ahora estamos diciendo: “escucha en el slot el evento avatar-changed y re-emítelo” -->
      <slot v-on:avatar-changed="(url: string) => emit('avatar-changed', url)" />
    </main>
    <div v-if="!isSidebarOpen"
      class="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-2xl flex justify-around py-4 rounded-t-3xl z-50 transition-all duration-300 ease-in-out transform scale-100">
      <button v-if="props.isAdmin" @click="emit('ver-admin')"
        class="text-gray-700 font-bold flex flex-col items-center transition duration-300 ease-in-out transform hover:scale-110 hover:text-gray-900">
        <img src="@/assets/emogis/emogy4.png" alt="Panel Admin" class="w-10 h- mt-0.5" />
      </button>
      <button v-else-if="props.isArbitro" @click="emit('panel-arbitro')"
        class="text-gray-700 font-bold flex flex-col items-center transition duration-300 ease-in-out transform hover:scale-110 hover:text-gray-900">
        <img src="@/assets/emogis/emogy5.png" alt="Panel Árbitro" class="w-10 h- mt-0.5" />
      </button>
      <button v-else @click="emit('ver-estadisticas')"
        class="text-gray-700 font-bold flex flex-col items-center transition duration-300 ease-in-out transform hover:scale-110 hover:text-gray-900">
        <img src="@/assets/emogis/emogy6.png" alt="Menú" class="w-10 h- mt-0.5" />
      </button>
      <button @click="isSidebarOpen = true"
        class="text-gray-700 font-bold flex flex-col items-center transition duration-300 ease-in-out transform hover:scale-110 hover:text-gray-900">
        <img src="@/assets/emogis/emogy1.png" alt="Menú" class="w-10 h- mt-0.5" />
      </button>
      <button @click="emit('ver-perfil')"
        class="text-gray-700 font-bold flex flex-col items-center transition duration-300 ease-in-out transform hover:scale-110 hover:text-gray-900">
        <img src="@/assets/emogis/emogy2.png" alt="perfil" class="w-10 h- mt-0.5" />
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import ComponenteDiv from '@/components/ComponenteDiv.vue';
import ComponenteH2 from '@/components/ComponenteH2.vue';
import { defineEmits, ref, onMounted, computed } from 'vue';
import axios from 'axios';
import ComponenteBoton from '@/components/ComponenteBoton.vue';

const emit = defineEmits(['CerrarSesion', 'ver-perfil', 'crear-equipo', 'ver-mi-equipo', 'unirse-equipo', 'ver-partidos', 'panel-arbitro', 'ver-inicio', 'ver-estadisticas', 'ver-admin', 'ver-ajustes', 'avatar-changed', 'ver-reportes', 'ver-reportesAdmin', 'ver-estadios']);
const props = defineProps<{ avisoPerfil: boolean, hasEquipo: boolean, isCaptain: boolean, isArbitro: boolean, username: string, userAvatar: string, isAdmin: boolean }>()
const isSidebarOpen = ref(false)
const isMenuCollapsed = ref(false)
const searchQuery = ref('')
const isDesktop = computed(() => window.innerWidth >= 768)

const toggleMenu = () => {
  isMenuCollapsed.value = !isMenuCollapsed.value
}

const matches = (label: string) => {
  return label.toLowerCase().includes(searchQuery.value.toLowerCase())
}

const cerrarSesion = async () => {
  try {
    await axios.post('http://localhost:3000/usuarios/logout', {}, {
      withCredentials: true
    })
  } catch (err) {
    console.error('Error al cerrar sesión:', err)
  }
  emit("CerrarSesion");
}

const btnClass = (key: string, disabled = false) => {
  const base = 'w-full flex items-center px-4 py-3 rounded-xl font-medium transition duration-300 hover:scale-105'
  const active = ''
  const inactive = 'bg-gray-100 text-gray-700 hover:bg-gray-200'
  return [
    base,
    selectedKey.value === key ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg' : inactive,
    isMenuCollapsed.value ? 'justify-center' : '',
    disabled ? 'opacity-50 cursor-not-allowed' : ''
  ].join(' ')
}
const selectedKey = ref<string | null>(null)
const selectKey = (key: string) => {
  selectedKey.value = key
}

// Forzar reactividad de isCaptain para el menú
const isCaptain = computed(() => props.isCaptain)

const navigate = (eventName: string) => {
  selectedKey.value = eventName
  emit(eventName as any)
  if (!isDesktop.value) {
    isSidebarOpen.value = false
  }
}
</script>

<style scoped>
.slide-enter-active,
.slide-leave-acive {
  transition: transform 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(-100%);
}
</style>