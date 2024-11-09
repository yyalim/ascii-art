<script setup lang="ts">
import { createUpload } from '../api/'
import { ref } from 'vue'

defineProps<{ modelValue: string }>()
const emit = defineEmits<{ (e: 'update:modelValue', value: string): void }>()
const isLoading = ref<boolean>(false)

async function onFormSubmit(e: Event) {
  e.preventDefault()

  emit('update:modelValue', '')
  const formData = new FormData(e.target as HTMLFormElement)

  try {
    isLoading.value = true
    const data = await createUpload(formData)
    emit('update:modelValue', data.fileId)
  } catch (err) {
    console.error(err)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <form
    @submit="onFormSubmit"
    class="w-full max-w-md bg-white p-6 rounded-lg shadow-md space-y-4 p-2"
  >
    <fieldset>
      <legend class="w-full m-3">
        <h1 class="text-2xl font-semibold text-gray-800 text-center">ASCII ART UPLOADER</h1>
      </legend>
      <label for="file" class="block text-sm font-medium text-gray-700 m-3">
        Text File
        <input
          type="file"
          accept=".txt"
          name="file"
          required
          aria-label="Text File"
          class="w-full mt-1 focus:ring-indigo-500 focus:border-indigo-500"
        />
      </label>
      <label for="interval" class="text-sm font-medium text-gray-700 m-3">
        Interval (ms)
        <input
          type="number"
          name="interval"
          required
          aria-label="Interval in milliseconds"
          class="ml-4 w-24 border border-slate-200 focus:ring-indigo-500 focus:border-indigo-500 text-center"
        />
      </label>
      <input
        type="submit"
        value="Print"
        :disabled="isLoading"
        class="w-full mt-4 px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      />
    </fieldset>
  </form>
</template>
