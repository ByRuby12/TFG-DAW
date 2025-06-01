<template>
  <div class="mx-auto p-4 sm:p-8 bg-white rounded-2xl shadow-lg">
    <h1 class="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-8 text-center">Panel Admin</h1>
    <div class="space-y-6">
      <!-- USUARIOS -->
      <div class="bg-white rounded-lg shadow-md p-4">
        <div class="flex items-center justify-between cursor-pointer select-none" @click="showUsers = !showUsers">
          <h2 class="text-lg font-semibold text-indigo-700 mb-0">Usuarios</h2>
          <span class="text-indigo-600 text-xl">{{ showUsers ? '➤' : '▼' }}</span>
        </div>
        <transition name="fade">
          <div v-show="showUsers" class="mt-3 space-y-4">
            <input v-model="userFilter" type="text" placeholder="Buscar usuario por nombre..."
              class="w-full px-3 py-2 mb-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <div v-for="u in recentUsers" :key="u.id" class="border rounded-lg shadow-md p-4">
              <p class="text-sm font-semibold">ID: {{ u.id }}</p>
              <p class="text-sm">Usuario: {{ u.Nombreusu }}</p>
              <div class="mt-2 flex space-x-2">
                <button @click="startEditUser(u)"
                  class="px-2 py-1 bg-yellow-400 hover:bg-yellow-500 text-white rounded text-xs">
                  Modificar
                </button>
                <button @click="pedirConfirmacion('usuario', u.id, u.Nombreusu)"
                  class="px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-xs">
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </transition>
      </div>
      <!-- PARTIDOS -->
      <div class="bg-white rounded-lg shadow-md p-4">
        <div class="flex items-center justify-between cursor-pointer select-none" @click="showMatches = !showMatches">
          <h2 class="text-lg font-semibold text-indigo-700 mb-0">Partidos</h2>
          <span class="text-indigo-600 text-xl">{{ showMatches ? '➤' : '▼' }}</span>
        </div>
        <transition name="fade">
          <div v-show="showMatches" class="mt-3 space-y-4">
            <input v-model="matchFilter" type="text" placeholder="Buscar partido(Ej: Tigres vs Leones)"
              class="w-full px-3 py-2 mb-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <div v-for="m in recentMatches" :key="m.id" class="border rounded-lg shadow-md p-4">
              <p class="text-sm font-semibold">ID: {{ m.id }}</p>
              <p class="text-sm">Equipos: {{ m.equipoLocal.nombre }} vs {{ m.equipoVisitante.nombre }}</p>
              <p class="text-sm">Fecha: {{ formatFecha(m.fechaInicio) }}</p>
              <p class="text-sm">Hora: {{ formatTime(m.fechaInicio) }}</p>
              <div class="mt-2 flex space-x-2">
                <button @click="startEditMatch(m)"
                  class="px-2 py-1 bg-yellow-400 hover:bg-yellow-500 text-white rounded text-xs">
                  Modificar
                </button>
                <button
                  @click="pedirConfirmacion('partido', m.id, `${m.equipoLocal.nombre} vs ${m.equipoVisitante.nombre}`)"
                  class="px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-xs">
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </transition>
      </div>
      <!-- EQUIPOS -->
      <div class="bg-white rounded-lg shadow-md p-4">
        <div class="flex items-center justify-between cursor-pointer select-none" @click="showTeams = !showTeams">
          <h2 class="text-lg font-semibold text-indigo-700 mb-0">Equipos</h2>
          <span class="text-indigo-600 text-xl">{{ showTeams ? '➤' : '▼' }}</span>
        </div>
        <transition name="fade">
          <div v-show="showTeams" class="mt-3 space-y-4">
            <input v-model="teamFilter" type="text" placeholder="Buscar equipo por nombre..."
              class="w-full px-3 py-2 mb-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <div v-for="t in recentTeams" :key="t.id" class="border rounded-lg shadow-md p-4">
              <p class="text-sm font-semibold">ID: {{ t.id }}</p>
              <p class="text-sm">Nombre: {{ t.nombre }}</p>
              <p class="text-sm">Líder: {{ t.creador.usuario.Nombreusu }}</p>
              <div class="mt-2 flex space-x-2">
                <button @click="startEditTeam(t)"
                  class="px-2 py-1 bg-yellow-400 hover:bg-yellow-500 text-white rounded text-xs">
                  Modificar
                </button>
                <button @click="pedirConfirmacion('equipo', t.id, t.nombre)"
                  class="px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-xs">
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </div>
  <!-- Modal Editar Usuario -->
  <div v-if="editingUser" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
    <div class="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
      <h3 class="text-xl font-semibold mb-4">Editar Usuario</h3>
      <input v-model="editingUser.Nombreusu" type="text" placeholder="Nombre de usuario"
        class="w-full border px-3 py-2 rounded-lg mb-3" />
      <select v-model="editingUser.rol" class="w-full border px-3 py-2 rounded-lg mb-4">
        <option disabled value="">Selecciona un rol</option>
        <option value="administrador">Administrador</option>
        <option value="jugador">Jugador</option>
        <option value="arbitro">Árbitro</option>
      </select>
      <div class="flex justify-end space-x-2">
        <button @click="editingUser = null" class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancelar</button>
        <button @click="saveUser"
          class="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">Guardar</button>
      </div>
    </div>
  </div>
  <!-- Modal Editar Partido -->
  <div v-if="editingMatch"
    class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center px-2 sm:px-0">
    <div class="bg-white p-2 sm:p-8 rounded-lg shadow-lg max-w-4xl w-full overflow-y-auto max-h-[98vh]">
      <h2 class="text-xl sm:text-2xl font-bold text-blue-700 mb-4 sm:mb-7 text-center">
        {{ editingMatch.equipoLocal.nombre }} vs {{ editingMatch.equipoVisitante.nombre }}
      </h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 mb-6">
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1">Fecha y Hora</label>
          <input v-model="editingMatch.fechaInicio" type="datetime-local" class="w-full border px-3 py-2 rounded-lg" />
        </div>
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1">Estadio</label>
          <input v-model="editingMatch.estadio" list="estadios-list" type="text" placeholder="Estadio"
            class="w-full border px-3 py-2 rounded-lg" />
          <datalist id="estadios-list">
            <option v-for="(e, i) in estadios" :key="i" :value="e.direccion"></option>
          </datalist>
        </div>
      </div>
      <section class="mb-4 sm:mb-6">
        <label class="block text-sm font-semibold text-gray-700 mb-1">Goles</label>
        <div v-if="editingMatch.goles && editingMatch.goles.length > 2" class="mb-2">
          <button @click="showAllGoles = !showAllGoles" class="text-blue-700 font-semibold underline mb-2">
            {{ showAllGoles ? 'Mostrar menos' : 'Mostrar todos (' + editingMatch.goles.length + ')' }}
          </button>
        </div>
        <div
          v-for="(g, i) in (editingMatch.goles && editingMatch.goles.length > 2 && !showAllGoles ? editingMatch.goles.slice(0, 2) : editingMatch.goles)"
          :key="i" class="mb-2">
          <div @click="toggleOpen(g, 'gol', i)"
            class="flex items-center justify-between bg-blue-50 rounded-lg px-3 py-2 cursor-pointer select-none">
            <span class="font-semibold text-blue-700 text-sm">Gol {{ i + 1 }} - {{ g.jugador || 'Sin jugador' }}</span>
            <!-- @ts-ignore -->
            <span class="text-blue-600">{{ g.__open ? '▲' : '▼' }}</span>
          </div>
          <transition name="fade">
            <div v-show="g.__open" class="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-2 bg-blue-50 rounded-lg p-2">
              <div class="flex flex-col gap-2 w-full sm:w-1/4">
                <select v-model="g.equipo" class="border p-2 sm:p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-500">
                  <option disabled value="">Equipo</option>
                  <option value="local">{{ editingMatch.equipoLocal.nombre }}</option>
                  <option value="visitante">{{ editingMatch.equipoVisitante.nombre }}</option>
                </select>
              </div>
              <div class="flex flex-col gap-2 w-full sm:w-1/4">
                <select v-model="g.jugador"
                  class="border p-2 sm:p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-500">
                  <option disabled value="">Jugador</option>
                  <option v-for="name in g.equipo === 'local' ? localPlayers : visitingPlayers" :key="name"
                    :value="name">{{ name }}</option>
                </select>
              </div>
              <div class="flex flex-col gap-2 w-full sm:w-1/4">
                <select v-model="g.asistidoPor"
                  class="border p-2 sm:p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-500">
                  <option disabled value="">Asistido por</option>
                  <option v-for="name in g.equipo === 'local' ? localPlayers : visitingPlayers" :key="name + '-assist'"
                    :value="name">{{ name }}</option>
                </select>
              </div>
              <div class="flex flex-col gap-2 w-full sm:w-1/4">
                <select v-model="g.tipo" class="border p-2 sm:p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-500">
                  <option value="normal">Normal</option>
                  <option value="penalti">Penalti</option>
                  <option value="falta">Falta</option>
                  <option value="corner">Córner</option>
                </select>
              </div>
              <div class="flex flex-col gap-2 w-full sm:w-1/4">
                <input v-model="g.minuto" type="time"
                  class="border p-2 sm:p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-500">
              </div>
              <button @click="removeGol(i)" class="text-red-500 self-center">✕</button>
            </div>
          </transition>
        </div>
        <button @click="addGol" class="text-blue-600 text-sm font-semibold hover:underline">+ Añadir gol</button>
      </section>
      <section class="mb-4 sm:mb-6">
        <label class="block text-sm font-semibold text-gray-700 mb-1">Tarjetas</label>
        <div v-if="editingMatch.tarjetas && editingMatch.tarjetas.length > 2" class="mb-2">
          <button @click="showAllTarjetas = !showAllTarjetas" class="text-yellow-700 font-semibold underline mb-2">
            {{ showAllTarjetas ? 'Mostrar menos' : 'Mostrar todas (' + editingMatch.tarjetas.length + ')' }}
          </button>
        </div>
        <div
          v-for="(t, i) in (editingMatch.tarjetas && editingMatch.tarjetas.length > 2 && !showAllTarjetas ? editingMatch.tarjetas.slice(0, 2) : editingMatch.tarjetas)"
          :key="i" class="mb-2">
          <div @click="toggleOpen(t, 'tarjeta', i)"
            class="flex items-center justify-between bg-yellow-50 rounded-lg px-3 py-2 cursor-pointer select-none">
            <span class="font-semibold text-yellow-700 text-sm">Tarjeta {{ i + 1 }} - {{ t.jugador || 'Sin jugador'
              }}</span>
            <!-- @ts-ignore -->
            <span class="text-yellow-600">{{ t.__open ? '▲' : '▼' }}</span>
          </div>
          <transition name="fade">
            <div v-show="t.__open" class="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-2 bg-yellow-50 rounded-lg p-2">
              <div class="flex flex-col gap-2 w-full sm:w-1/2">
                <select v-model="t.equipo" class="border p-2 sm:p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-500">
                  <option disabled value="">Equipo</option>
                  <option value="local">{{ editingMatch.equipoLocal.nombre }}</option>
                  <option value="visitante">{{ editingMatch.equipoVisitante.nombre }}</option>
                </select>
              </div>
              <div class="flex flex-col gap-2 w-full sm:w-1/2">
                <select v-model="t.jugador"
                  class="border p-2 sm:p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-500">
                  <option disabled value="">Jugador</option>
                  <option v-for="name in t.equipo === 'local' ? localPlayers : visitingPlayers" :key="name + '-card'"
                    :value="name">{{ name }}</option>
                </select>
              </div>
              <div class="flex flex-col gap-2 w-full sm:w-1/2">
                <select v-model="t.tipo" class="border p-2 sm:p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-500">
                  <option value="amarilla">Amarilla</option>
                  <option value="roja">Roja</option>
                </select>
              </div>
              <div class="flex flex-col gap-2 w-full sm:w-1/2">
                <input v-model="t.minuto" type="time"
                  class="border p-2 sm:p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-500" />
              </div>
              <button @click="removeTarjeta(i)" class="text-red-500 self-center">✕</button>
            </div>
          </transition>
        </div>
        <button @click="addTarjeta" class="text-blue-600 text-sm font-semibold hover:underline">+ Añadir
          tarjeta</button>
      </section>
      <div class="flex flex-col sm:flex-row gap-4 justify-between">
        <button @click="saveMatch"
          class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition duration-300 w-full sm:w-auto">
          Guardar todos los cambios
        </button>
        <button @click="editingMatch = null"
          class="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg transition duration-300 w-full sm:w-auto">
          Cancelar
        </button>
      </div>
    </div>
  </div>
  <!-- Modal Editar Equipo -->
  <div v-if="editingTeam" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
    <div class="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
      <h3 class="text-xl font-semibold mb-4">Editar Equipo</h3>
      <div class="space-y-3 mb-4">
        <input v-model="editingTeam.nombre" type="text" placeholder="Nombre del equipo"
          class="w-full border px-3 py-2 rounded-lg" />
        <input v-model="editingTeam.siglas" type="text" placeholder="Siglas del equipo"
          class="w-full border px-3 py-2 rounded-lg" />
        <input v-model="editingTeam.color" type="text" placeholder="Color" class="w-full border px-3 py-2 rounded-lg" />
        <input v-model="editingTeam.estadio" list="estadios-list" placeholder="Direccion del estadio"
          class="w-full border px-3 py-2 rounded-lg" />
        <datalist id="estadios-list">
          <option v-for="(e, i) in estadios" :key="i" :value="e.direccion"></option>
        </datalist>
        <input v-model="editingTeam.claveAcceso" type="text" placeholder="Clave de acceso"
          class="w-full border px-3 py-2 rounded-lg" maxlength="4" />
      </div>
      <div class="flex justify-end space-x-2">
        <button @click="editingTeam = null" class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancelar</button>
        <button @click="saveTeam"
          class="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">Guardar</button>
      </div>
    </div>
  </div>
  <div v-if="mostrarConfirmacion" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
    <div class="bg-white p-6 rounded-xl shadow-xl w-[90%] max-w-md text-center">
      <h2 class="text-xl font-semibold mb-4 text-gray-800">¿Estás seguro?</h2>
      <p class="text-gray-600 mb-6">Vas a eliminar el <strong>{{ objetoAEliminar.tipo }}</strong><br>
        «{{ objetoAEliminar.nombre }}»
      </p>
      <div class="flex justify-center gap-4">
        <button @click="confirmarEliminacion"
          class="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded">
          Eliminar
        </button>
        <button @click="cancelarEliminacion"
          class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded">
          Cancelar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import axios from 'axios';
import { ref, computed, onMounted, watch, nextTick } from 'vue';

axios.defaults.withCredentials = true

interface User {
  id: number;
  Nombreusu: string;
  correo: string;
  rol: 'jugador' | 'arbitro' | 'administrador';
}
interface Match {
  id: number;
  fechaInicio: string;
  equipoLocal: { id: number, nombre: string };
  equipoVisitante: { id: number, nombre: string };
  estadio: string
  codigoPostal: string
  goles?: Gol[];
  tarjetas?: Tarjeta[];
}
interface Team {
  id: number;
  nombre: string;
  siglas: string
  color: string
  estadio: string
  claveAcceso: string
  creador: { usuario: { Nombreusu: string } };
}

interface Gol { equipo: string; jugador: string; asistidoPor: string; tipo: string; minuto: string; __open?: boolean }
interface Tarjeta { equipo: string; jugador: string; tipo: string; minuto: string; __open?: boolean }

const localPlayers = ref<string[]>([]);
const visitingPlayers = ref<string[]>([]);
const userFilter = ref('')
const matchFilter = ref('')
const teamFilter = ref('')
const users = ref<User[]>([])
const matches = ref<Match[]>([])
const teams = ref<Team[]>([])
const estadios = ref<{ direccion: string }[]>([])
const currentUser = ref<{ Nombreusu: string, rol: string } | null>(null)
const mostrarConfirmacion = ref(false)
const objetoAEliminar = ref<{ tipo: string; id: number | null; nombre: string }>({
  tipo: '',
  id: null,
  nombre: ''
})

const pedirConfirmacion = (tipo: string, id: number, nombre: string) => {
  objetoAEliminar.value = { tipo, id, nombre }
  mostrarConfirmacion.value = true
}
const cancelarEliminacion = () => {
  mostrarConfirmacion.value = false
  objetoAEliminar.value = { tipo: '', id: null, nombre: '' }
}

const confirmarEliminacion = async () => {
  try {
    const { tipo, id } = objetoAEliminar.value
    if (tipo === 'usuario') {
      await axios.delete(`http://localhost:3000/usuarios/${id}`)
      users.value = users.value.filter(u => u.id !== id)
    }
    if (tipo === 'partido') {
      await axios.delete(`http://localhost:3000/partidos/${id}`)
      matches.value = matches.value.filter(m => m.id !== id)
    }
    if (tipo === 'equipo') {
      await axios.delete(`http://localhost:3000/equipos/${id}`)
      teams.value = teams.value.filter(t => t.id !== id)
    }
  } catch (err: any) {
    if (err.response?.status === 400) {
      alert(err.response.data.message || 'No se puede eliminar');
    } else {
      console.error(err);
    }
  } finally {
    cancelarEliminacion()
  }
}

onMounted(async () => {
  try {
    const { data } = await axios.get('http://localhost:3000/usuarios/me');
    if (data.success && data.rol === 'administrador') {
      currentUser.value = data;
      await loadAll();
      await fetchEstadios()   // aquí cargas users, partidos y equipos
    } else {
      // redirigir o mostrar un mensaje de “no tienes permiso”
      window.location.href = '/';
    }
  } catch (err) {
    console.error('No autenticado', err);
    window.location.href = '/login';
  }
})
const loadAll = async () => {
  const [u, m, t] = await Promise.all([
    axios.get<User[]>('http://localhost:3000/usuarios', { withCredentials: true }),
    axios.get<Match[]>('http://localhost:3000/partidos', { withCredentials: true }),
    axios.get<Team[]>('http://localhost:3000/equipos/detallado', { withCredentials: true })
  ])
  users.value = u.data
  matches.value = m.data
  teams.value = t.data
}
const recentUsers = computed(() =>
  users.value.filter(u => u.Nombreusu.toLowerCase().includes(userFilter.value.toLowerCase())).slice(-3)
)
const recentMatches = computed(() =>
  matches.value
    .filter(m => `${m.equipoLocal.nombre} vs ${m.equipoVisitante.nombre}`.toLowerCase()
      .includes(matchFilter.value.toLowerCase()))
    .slice(-3)
)
const recentTeams = computed(() =>
  teams.value
    .filter(t => t.nombre.toLowerCase().includes(teamFilter.value.toLowerCase()))
    .slice(-3)
)
const editingUser = ref<User | null>(null)
const editingMatch = ref<Match | null>(null)
const editingTeam = ref<Team | null>(null)

const addGol = () => {
  if (editingMatch.value) {
    editingMatch.value.goles!.push({ equipo: '', jugador: '', asistidoPor: '', tipo: 'normal', minuto: '00:00' });
  }
};
const removeGol = (i: number) => {
  editingMatch.value?.goles!.splice(i, 1);
};
const addTarjeta = () => {
  if (editingMatch.value) {
    editingMatch.value.tarjetas!.push({ equipo: '', jugador: '', tipo: 'amarilla', minuto: '00:00' });
  }
};

const removeTarjeta = (i: number) => {
  editingMatch.value?.tarjetas!.splice(i, 1);
};

const startEditUser = (u: User) => {
  editingUser.value = { ...u }
}
const deleteUser = async (id: number) => {
  await axios.delete(`http://localhost:3000/usuarios/${id}`, { withCredentials: true })
  users.value = users.value.filter(u => u.id !== id)
}
const startEditMatch = async (m: Match) => {
  const copia: Match = JSON.parse(JSON.stringify(m));
  if (!Array.isArray(copia.goles)) {
    copia.goles = [];
  }
  if (!Array.isArray(copia.tarjetas)) {
    copia.tarjetas = [];
  }
  // Formatear fecha para input datetime-local
  copia.fechaInicio = toDatetimeLocal(copia.fechaInicio);
  editingMatch.value = copia;
  const [r1, r2] = await Promise.all([
    axios.get<{ jugadores: { Nombreusu: string }[] }>(`http://localhost:3000/equipos/${m.equipoLocal.id}/jugadores`),
    axios.get<{ jugadores: { Nombreusu: string }[] }>(`http://localhost:3000/equipos/${m.equipoVisitante.id}/jugadores`)
  ]);
  localPlayers.value = r1.data.jugadores.map(j => j.Nombreusu);
  visitingPlayers.value = r2.data.jugadores.map(j => j.Nombreusu)
}
const deleteMatch = async (id: number) => {
  await axios.delete(`http://localhost:3000/partidos/${id}`, { withCredentials: true })
  matches.value = matches.value.filter(m => m.id !== id)
}
const startEditTeam = (t: Team) => {
  editingTeam.value = { ...t }
}
const deleteTeam = async (id: number) => {
  await axios.delete(`http://localhost:3000/equipos/${id}`, { withCredentials: true })
  teams.value = teams.value.filter(t => t.id !== id)
}
const saveUser = async () => {
  if (!editingUser.value) return
  await axios.put(`http://localhost:3000/usuarios/${editingUser.value.id}`, {
    Nombreusu: editingUser.value.Nombreusu,
    rol: editingUser.value.rol
  }, { withCredentials: true })
  users.value = users.value.map(u => u.id === editingUser.value!.id ? editingUser.value! : u)
  editingUser.value = null
}
const saveMatch = async () => {
  if (!editingMatch.value) return
  const m = editingMatch.value
  await axios.put(`http://localhost:3000/partidos/${m.id}`, {
    fechaInicio: m.fechaInicio,
    estadio: m.estadio,
    codigoPostal: m.codigoPostal,
    goles: m.goles,
    tarjetas: m.tarjetas
  }, { withCredentials: true })
  matches.value = matches.value.map(x => x.id === m.id ? m : x)
  editingMatch.value = null
}
const saveTeam = async () => {
  if (!editingTeam.value) return
  const t = editingTeam.value
  await axios.put(`http://localhost:3000/equipos/${t.id}`, {
    nombre: t.nombre,
    siglas: t.siglas,
    color: t.color,
    estadio: t.estadio,
    claveAcceso: t.claveAcceso
  }, { withCredentials: true })
  teams.value = teams.value.map(x => x.id === t.id ? t : x)
  editingTeam.value = null
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

const formatFecha = (raw: string) => {
  const d = new Date(raw)
  return d.toLocaleDateString([], { year: 'numeric', month: '2-digit', day: '2-digit' })
}

const formatTime = (raw: string) => {
  const d = new Date(raw)
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

// Utilidad para formatear fecha a yyyy-MM-ddTHH:mm para input datetime-local
function toDatetimeLocal(dateString: string) {
  if (!dateString) return '';
  const d = new Date(dateString);
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

const showUsers = ref(true)
const showMatches = ref(false)
const showTeams = ref(false)
const showAllGoles = ref(false)
const showAllTarjetas = ref(false)
function toggleOpen(item: any, tipo: 'gol' | 'tarjeta', idx: number) {
  // @ts-ignore
  if (typeof item.__open !== 'boolean') item.__open = false;
  // @ts-ignore
  item.__open = !item.__open;
  // Cierra los demás del mismo tipo
  const arr = tipo === 'gol' ? editingMatch.value?.goles : editingMatch.value?.tarjetas;
  if (Array.isArray(arr)) {
    arr.forEach((el, i) => {
      if (el !== item) {
        // @ts-ignore
        el.__open = false;
      }
    });
  }
}
// Utilidad para añadir propiedad reactiva __open a goles y tarjetas (Vue reactividad y TS safe)
function addOpenFlag(arr: any[] | undefined, openFirst = true) {
  if (Array.isArray(arr)) {
    arr.forEach((item, i) => {
      // @ts-ignore
      if (typeof item.__open !== 'boolean') {
        // Vue 3 reactividad: defineProperty para que sea reactivo
        // @ts-ignore
        item.__open = false;
      }
      // @ts-ignore
      item.__open = openFirst ? i === 0 : false;
    });
  }
}
watch(editingMatch, (val) => {
  if (val) {
    addOpenFlag(val.goles, true);
    addOpenFlag(val.tarjetas, true);
    showAllGoles.value = false;
    showAllTarjetas.value = false;
  }
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>