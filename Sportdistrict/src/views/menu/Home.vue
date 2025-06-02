<template>
  <div class="mx-auto">
      <!-- Panel principal -->
      <div class="bg-white shadow-2xl rounded-2xl p-5 mb-1 border border-indigo-100">
        <!-- Introducción -->
        <section class="text-center mb-12">
          <h2 class="text-4xl md:text-5xl font-extrabold text-indigo-800 mb-4 drop-shadow-lg">
            Bienvenido a Deportistas del Barrio
          </h2>
          <p class="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto mb-6 leading-relaxed">
            <span class="font-semibold text-indigo-600">Deportistas del Barrio</span> es una plataforma creada para impulsar la práctica del fútbol sala en tu barrio. 
            Nuestra misión es facilitar la creación de equipos, organización de partidos, ligas y torneos, todo en un ambiente 
            amigable, competitivo y accesible para todos. 
            <br class="hidden md:block" />
            ¡Forma parte de esta comunidad deportiva y lleva tu pasión al siguiente nivel!
          </p>
          <!-- Logo -->
          <div class="flex justify-center mt-6">
            <img 
              src="@/assets/logo/logo.png" 
              alt="Logo Deportistas del Barrio" 
              class="h-28 md:h-36 w-auto drop-shadow-md transition-transform duration-300 hover:scale-105 bg-white rounded-full border-4 border-indigo-200 p-2"
            />
          </div>
        </section>
  
        <!-- ¿Qué puedes hacer en Deportistas del Barrio? -->
        <section class="mb-12">
        <h3 class="text-3xl font-semibold text-indigo-800 text-center mb-8">¿Qué puedes hacer en Deportistas del Barrio?</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div class="p-6 bg-white shadow-lg rounded-2xl text-center flex flex-col items-center gap-2 border border-indigo-100 hover:shadow-xl transition">
              <span class="text-4xl mb-2">⚽</span>
              <h4 class="text-2xl font-semibold text-indigo-600 mb-2">Organizar Partidos</h4>
              <p class="text-gray-600">Crea partidos personalizados entre amigos o jugadores de la comunidad. ¡Es sencillo organizar encuentros y disfrutar del fútbol sala!</p>
            </div>
            <div class="p-6 bg-white shadow-lg rounded-2xl text-center flex flex-col items-center gap-2 border border-indigo-100 hover:shadow-xl transition">
              <span class="text-4xl mb-2">🤝</span>
              <h4 class="text-2xl font-semibold text-indigo-600 mb-2">Unirse a un Equipo</h4>
              <p class="text-gray-600">Si no tienes equipo, puedes unirte a uno ya existente. Encuentra un equipo que comparta tu pasión por el fútbol y empieza a jugar.</p>
            </div>
            <div class="p-6 bg-white shadow-lg rounded-2xl text-center flex flex-col items-center gap-2 border border-indigo-100 hover:shadow-xl transition">
              <span class="text-4xl mb-2">🆕</span>
              <h4 class="text-2xl font-semibold text-indigo-600 mb-2">Crear tu Propio Equipo</h4>
              <p class="text-gray-600">Si eres líder o te gustaría serlo, puedes crear tu propio equipo, gestionar jugadores y participar en ligas o torneos de la plataforma.</p>
            </div>
            <div class="p-6 bg-white shadow-lg rounded-2xl text-center flex flex-col items-center gap-2 border border-indigo-100 hover:shadow-xl transition">
              <span class="text-4xl mb-2">🧑‍⚖️</span>
              <h4 class="text-2xl font-semibold text-indigo-600 mb-2">Ser Árbitro</h4>
              <p class="text-gray-600">Si te apasiona el fútbol y tienes conocimiento del reglamento, puedes convertirte en árbitro. Ayuda a mantener el orden y la justicia en los partidos.</p>
            </div>
            <div class="p-6 bg-white shadow-lg rounded-2xl text-center flex flex-col items-center gap-2 border border-indigo-100 hover:shadow-xl transition">
              <span class="text-4xl mb-2">🛡️</span>
              <h4 class="text-2xl font-semibold text-indigo-600 mb-2">Ser Administrador</h4>
              <p class="text-gray-600">Si tienes habilidades organizativas, puedes ser administrador. Gestiona torneos, ligas y equipos dentro de la plataforma.</p>
            </div>
            <div class="p-6 bg-white shadow-lg rounded-2xl text-center flex flex-col items-center gap-2 border border-indigo-100 hover:shadow-xl transition">
              <span class="text-4xl mb-2">📊</span>
              <h4 class="text-2xl font-semibold text-indigo-600 mb-2">Ver Estadísticas de Jugadores</h4>
              <p class="text-gray-600">Puedes consultar las estadísticas de jugadores de la comunidad para tomar decisiones informadas sobre posibles fichajes. Analiza el rendimiento en partidos previos, goles, asistencias y más para asegurarte de que incorporas a los mejores jugadores a tu equipo.</p>
            </div>
        </div>
        </section>

        <!-- Información adicional -->
        <section>
        <h3 class="text-3xl font-semibold text-indigo-800 text-center mb-8">Futuras Mejoras en la Plataforma</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div class="p-6 bg-indigo-100 shadow-lg rounded-2xl text-center flex flex-col items-center gap-2 border border-indigo-200">
              <span class="text-3xl mb-2">🏆</span>
              <h4 class="text-2xl font-semibold text-indigo-600 mb-2">Compite en Ligas y Torneos</h4>
              <p class="text-gray-600">Participa en ligas y torneos organizados para medir tus habilidades con otros equipos. ¡La competencia es intensa y divertida! Los equipos pueden inscribirse en distintos torneos según sus preferencias, ¡y ganar premios y trofeos!</p>
            </div>
            <div class="p-6 bg-indigo-100 shadow-lg rounded-2xl text-center flex flex-col items-center gap-2 border border-indigo-200">
              <span class="text-3xl mb-2">⭐</span>
              <h4 class="text-2xl font-semibold text-indigo-600 mb-2">Sistema de Puntos por Equipo</h4>
              <p class="text-gray-600">Los equipos podrán acumular puntos por victorias, empates y otros logros en partidos. Estos puntos podrán ser utilizados para mejorar el rendimiento y obtener recompensas exclusivas para el equipo.</p>
            </div>
            <div class="p-6 bg-indigo-100 shadow-lg rounded-2xl text-center flex flex-col items-center gap-2 border border-indigo-200">
              <span class="text-3xl mb-2">🛒</span>
              <h4 class="text-2xl font-semibold text-indigo-600 mb-2">Tienda de Merchandising</h4>
              <p class="text-gray-600">¡Vístete con los colores de tu equipo! Tendremos una tienda de merchandising donde podrás comprar camisetas, gorras, y otros productos con el logo de tu equipo o de la plataforma. ¡Demuestra tu pasión por el fútbol sala!</p>
            </div>
            <div class="p-6 bg-indigo-100 shadow-lg rounded-2xl text-center flex flex-col items-center gap-2 border border-indigo-200">
              <span class="text-3xl mb-2">🤖</span>
              <h4 class="text-2xl font-semibold text-indigo-600 mb-2">Chatbot con IA</h4>
              <p class="text-gray-600">Implementaremos un chatbot con inteligencia artificial para ayudarte en cualquier momento. Podrás interactuar con el bot para resolver dudas, obtener información sobre partidos, equipos y mucho más.</p>
            </div>
            <div class="p-6 bg-indigo-100 shadow-lg rounded-2xl text-center flex flex-col items-center gap-2 border border-indigo-200">
              <span class="text-3xl mb-2">📈</span>
              <h4 class="text-2xl font-semibold text-indigo-600 mb-2">Mejora en el Sistema de Estadísticas</h4>
              <p class="text-gray-600">Conocerás en tiempo real las estadísticas de los partidos, goles, asistencias y más. ¡Podrás comparar tus resultados con los de otros equipos y jugadores para ver quién es el mejor!</p>
            </div>
            <div class="p-6 bg-indigo-100 shadow-lg rounded-2xl text-center flex flex-col items-center gap-2 border border-indigo-200">
              <span class="text-3xl mb-2">🌍</span>
              <h4 class="text-2xl font-semibold text-indigo-600 mb-2">Expansión Internacional</h4>
              <p class="text-gray-600">En el futuro, queremos expandir la plataforma para incluir a jugadores y equipos de todo el mundo. Así podrás competir con equipos de diferentes países y vivir una experiencia internacional.</p>
            </div>
        </div>
        </section>

      </div>
    </div>
  </template>  
  
<script setup lang="ts">

    /*
    await nextTick()
  
    const script = document.createElement('script')
    script.src = 'https://unpkg.com/maplibre-gl@3.3.1/dist/maplibre-gl.js'
    script.onload = () => {
      const map = new window.maplibregl.Map({
        container: 'map',
        style: 'https://api.maptiler.com/maps/basic/style.json?key=O7cEwh4oZAI3rhlzLBBs', // Reemplaza con tu clave API
        center: markers[0].coords,
        zoom: 14
      })
  
      markers.forEach(marker => {
        new window.maplibregl.Marker()
          .setLngLat(marker.coords)
          .setPopup(new window.maplibregl.Popup().setText(marker.name))
          .addTo(map)
      })
    }
  
    document.head.appendChild(script)
    */
</script>

<style scoped>

</style>