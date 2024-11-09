import { onMounted, onUnmounted, ref } from 'vue'

export default function useWebSocket<T>(searchParams: Record<string, string>) {
  let ws: WebSocket | null = null
  const data = ref<T>()

  onMounted(async () => {
    try {
      ws = new WebSocket(import.meta.env.VITE_WS_URL + '?' + new URLSearchParams(searchParams).toString())
      ws.onmessage = (e) => {
        data.value = JSON.parse(e.data)
      }

      ws.onerror = (err) => {
        console.error(err)
      }

      ws.onclose = () => {
        ws = null
      }
    } catch (err) {
      console.error(err)
    }
  })

  onUnmounted(() => {
    if (ws) {
      ws.close()
      ws = null
    }
  })

  return { data };
}