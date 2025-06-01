<template>
  <div class="mx-auto p-8 bg-white rounded-2xl shadow-2xl space-y-8 border border-gray-200">
    <!-- Título e introducción -->
    <div class="text-center">
      <h1 class="text-3xl font-bold text-gray-800 mb-8 text-center">Estadios de Fútbol en la Comunidad de Madrid</h1>
      <p class="text-gray-600 text-lg leading-relaxed max-w-3xl mx-auto">
        Explora los distintos estadios de Fútbol Sala disponibles para organizar tus partidos. Puedes visualizar su
        ubicación en el mapa y decidir qué zona se adapta mejor a tu equipo.
        Recuerda que al crear tu equipo, podrás elegir uno de estos estadios como campo local.
      </p>
    </div>

    <!-- Contenedor del mapa -->
    <div class="relative overflow-hidden rounded-3xl border border-gray-300 shadow-md">
      <div class="h-96 w-full" id="map"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, nextTick } from 'vue'
  import axios from 'axios'
  import maplibregl from 'maplibre-gl'
  import 'maplibre-gl/dist/maplibre-gl.css'
  
  interface Estadio {
    direccion: string
    latitud: number
    longitud: number
  }

  const estadios = ref<Estadio[]>([])
  
  onMounted(async () => {
    let map: maplibregl.Map

  try {
    const { data } = await axios.get<Estadio[]>('http://localhost:3000/estadios', { withCredentials: true })
    estadios.value = data
  } catch (e) {
    console.error('Error cargando estadios:', e)
    estadios.value = []
  }

  map = new maplibregl.Map({
    container: 'map',
    style: 'https://api.maptiler.com/maps/basic/style.json?key=O7cEwh4oZAI3rhlzLBBs',
    center: estadios.value.length
      ? [estadios.value[0].longitud, estadios.value[0].latitud]
      : [-3.7038, 40.4168],
    zoom: 14
  })

  map.addControl(new maplibregl.NavigationControl())

 estadios.value
    .filter(e => typeof e.latitud === 'number' && typeof e.longitud === 'number')
    .forEach(estadio => {
      const popup = new maplibregl.Popup({ offset: 25 })
        .setText(estadio.direccion)
      new maplibregl.Marker()
        .setLngLat([estadio.longitud, estadio.latitud])
        .setPopup(popup)
        .addTo(map)
    })
})
</script>