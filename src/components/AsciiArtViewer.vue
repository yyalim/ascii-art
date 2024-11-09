<script setup lang="ts">
import type { AsciiMessage } from '../types/AsciiMessage'
import useWebSocket from '../hooks/useWebSocket'
import { ref, watch } from 'vue'

const props = defineProps<{ fileId: string }>()
const fileContent = ref<string>('')
const { data } = useWebSocket<AsciiMessage>({ fileId: props.fileId })

watch(data, (newData) => {
  if (newData) {
    fileContent.value += newData.line
  }
})
</script>

<template>
  <p
    class="max-w-md bg-gray-600 text-gray-100 font-medium p-6 rounded-lg shadow-md space-y-4 m-4 text-center"
  >
    {{ Math.floor(data?.percentage || 0) }}%
  </p>
  <pre class="whitespace-pre-wrap text-sm leading-6 border border-slate-700 bg-gray-400">{{
    fileContent
  }}</pre>
</template>
