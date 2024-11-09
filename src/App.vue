<script setup lang="ts">
import AsciiUploader from './components/AsciiArtUploader.vue'
import AsciiViewer from './components/AsciiArtViewer.vue'
import { ref } from 'vue'

const fileId = ref<string>('')
</script>

<template>
  <main class="min-h-screen flex flex-col items-center bg-gray-50 p-6">
    <ascii-uploader v-model="fileId" />
    <ascii-viewer v-if="fileId" :file-id="fileId" />
  </main>
</template>
