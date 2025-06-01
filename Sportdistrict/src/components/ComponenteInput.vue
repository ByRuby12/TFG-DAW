<template>
    <input
      v-bind="$attrs"
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      class="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
    />
  </template>
  
  <script lang="ts" setup>
  defineOptions({ inheritAttrs: false })
  
  defineProps<{
    modelValue: string
  }>()
  </script>