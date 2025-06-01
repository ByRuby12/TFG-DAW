<template>
    <ComponenteDiv>
      <h2 class="text-xl font-semibold text-yellow-800 mb-4">¡Atención!</h2>
      <p class="text-yellow-700 mb-4">
        Tu cuenta aún no ha sido confirmada. Revisa tu correo electrónico y haz clic en el enlace de confirmación para acceder al menú.
      </p>
      <button @click="volverLogin" class="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded">
        Volver al inicio de sesión
      </button>
    </ComponenteDiv>
</template>

<script lang="ts" setup>
import ComponenteDiv from '@/components/ComponenteDiv.vue';
import { defineEmits } from 'vue';

const emit = defineEmits(['volver-login'])

const volverLogin = () =>{
    emit('volver-login')
}
</script>