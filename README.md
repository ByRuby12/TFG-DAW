# Sportdistrict - Deportistas del Barrio

Sportdistrict es una plataforma web integral para la gestión, organización y participación en ligas deportivas de barrio. Su objetivo es digitalizar y facilitar la experiencia de jugadores, árbitros y administradores, permitiendo la gestión de equipos, partidos, estadísticas, reportes y mucho más desde cualquier dispositivo.

---

## Tabla de Contenidos
- [Descripción General](#descripción-general)
- [Características Principales](#características-principales)
- [Roles de Usuario](#roles-de-usuario)
- [Estructura de Carpetas](#estructura-de-carpetas)
- [Guía de Inicio Rápido](#guía-de-inicio-rápido)
- [Guía de Usuario](#guía-de-usuario)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Contribuir](#contribuir)
- [Licencia](#licencia)

---

## Descripción General
Sportdistrict digitaliza la gestión de ligas deportivas amateur, permitiendo a los usuarios:
- Crear y gestionar equipos.
- Inscribirse y participar en partidos.
- Consultar estadísticas y clasificaciones.
- Gestionar reportes e incidencias.
- Administrar usuarios, árbitros y estadios.

La plataforma está compuesta por un backend robusto en NestJS y un frontend moderno en Vue 3, ofreciendo una experiencia fluida y segura.

---

## Características Principales

### Para jugadores
- **Registro y autenticación:**
  - Registro tradicional y mediante Google.
  - Confirmación de cuenta por correo electrónico.
  - Recuperación de contraseña.
- **Gestión de perfil:**
  - Edición de datos personales y foto de perfil.
  - Visualización de estadísticas personales.
- **Equipos:**
  - Crear un equipo propio o unirse a uno existente.
  - Gestionar la plantilla si eres capitán.
  - Visualizar información y estadísticas del equipo.
- **Partidos:**
  - Consultar calendario, resultados y detalles de partidos.
  - Recibir notificaciones sobre próximos encuentros.
- **Reportes:**
  - Enviar reportes sobre incidencias en partidos o problemas con otros usuarios.

### Para árbitros
- **Panel de árbitro:**
  - Visualización de partidos asignados.
  - Gestión de incidencias y reportes durante los partidos.
  - Acceso a estadísticas de arbitraje.

### Para administradores
- **Panel de administración:**
  - Gestión de usuarios, equipos, partidos, estadios y reportes.
  - Visualización y resolución de reportes enviados por los usuarios.
  - Asignación de árbitros y gestión de roles.

### Otras funcionalidades
- **Gestión de estadios:**
  - Consulta y visualización de estadios en un mapa interactivo.
  - Información detallada de cada estadio.
- **Notificaciones y avisos:**
  - Avisos sobre el estado del perfil, partidos y otras acciones importantes.
- **Seguridad:**
  - Autenticación segura con JWT y cookies.
  - Protección de rutas según el rol del usuario.

---

## Roles de Usuario

- **Jugador:** Puede crear/gestionar equipos, inscribirse en partidos, consultar estadísticas y enviar reportes.
- **Árbitro:** Gestiona partidos asignados, reporta incidencias y consulta estadísticas de arbitraje.
- **Administrador:** Control total sobre la plataforma, gestión de usuarios, equipos, partidos, reportes y estadios.

---

## Estructura de Carpetas

- **backend/**: API REST con NestJS. Incluye módulos para:
  - Usuarios (registro, login, perfil, roles)
  - Equipos (creación, gestión, inscripción)
  - Partidos (calendario, resultados, incidencias)
  - Árbitros (asignación, gestión de partidos)
  - Estadios (gestión y consulta de estadios)
  - Reportes (gestión de incidencias y problemas)
  - Autenticación (JWT, Google, recuperación de contraseña)
  - Lógica de negocio y servicios auxiliares
- **Sportdistrict/**: Frontend en Vue 3. Incluye:
  - Vistas para cada panel de usuario (jugador, árbitro, admin)
  - Componentes reutilizables
  - Configuración de rutas y estado
  - Integración con la API backend
- **uploads/**: Almacena fotos de perfil y archivos subidos por los usuarios.

---

## Guía de Inicio Rápido

1. **Clona el repositorio y accede a la carpeta principal:**
   ```sh
   git clone <url-del-repo>
   cd Deportistas_del_barrio
   ```
2. **Instala las dependencias:**
   - Backend:
     ```sh
     cd backend
     npm install
     ```
   - Frontend:
     ```sh
     cd ../Sportdistrict
     npm install
     ```
3. **Configura la base de datos:**
   - Crea una base de datos MySQL/MariaDB y actualiza la configuración en `backend/src/app.module.ts`.
4. **Ejecuta el backend:**
   ```sh
   npm run start:dev
   ```
5. **Ejecuta el frontend:**
   ```sh
   npm run dev
   ```
6. **Accede a la aplicación:**
   - Abre tu navegador en `http://localhost:5173` (o el puerto configurado).

---

## Guía de Usuario

### Registro y acceso
- Puedes registrarte con tu correo electrónico o con tu cuenta de Google.
- Tras el registro, recibirás un correo de confirmación.
- Si olvidas tu contraseña, puedes recuperarla desde la pantalla de login.

### Gestión de perfil
- Accede a tu perfil desde el menú principal.
- Completa tus datos personales y sube una foto de perfil.
- Si tu perfil no está completo, recibirás un aviso.

### Equipos
- Crea un equipo desde el panel correspondiente o únete a uno existente.
- Si eres capitán, podrás gestionar la plantilla y aceptar/rechazar solicitudes.
- Consulta la información y estadísticas de tu equipo en el panel de equipo.

### Partidos
- Consulta el calendario de partidos y los resultados desde el panel de partidos.
- Recibe notificaciones sobre próximos partidos y cambios de horario.

### Estadísticas
- Accede a estadísticas personales y de equipo desde el panel de estadísticas.
- Consulta clasificaciones, goles, tarjetas y más.

### Reportes
- Envía reportes sobre incidencias en partidos o problemas con otros usuarios.
- Los administradores revisarán y gestionarán los reportes recibidos.

### Panel de árbitro
- Si eres árbitro, accede a tu panel para ver partidos asignados y reportar incidencias.

### Panel de administración
- Si eres administrador, accede al panel para gestionar usuarios, equipos, partidos, estadios y reportes.

### Estadios
- Consulta los estadios disponibles y su ubicación en el mapa.

---

## Tecnologías Utilizadas
- **Frontend:** Vue 3, TypeScript, Axios, Tailwind CSS
- **Backend:** NestJS, TypeORM, MySQL/MariaDB, Passport, JWT
- **Autenticación:** Local y Google OAuth 2.0
- **Otros:** Vite, ESLint, Prettier

---

## Contribuir
¿Quieres contribuir? ¡Eres bienvenido!
1. Haz un fork del repositorio.
2. Crea una rama para tu funcionalidad o corrección.
3. Haz tus cambios y abre un Pull Request.
4. Describe claramente tu aporte.

---

## Licencia
Este proyecto está bajo la licencia MIT.

---

## Video Presentación
[Video de YouTube](https://www.youtube.com/watch?v=R2lVWTkhcls)

¡Disfruta gestionando tu liga deportiva de barrio con Sportdistrict!
