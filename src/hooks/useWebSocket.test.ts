import { mount } from '@vue/test-utils'
import useWebSocket from './useWebSocket'
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'

const mockedComponent = {
  template: '<div> {{ data }}</div>',
  setup() {
    const { data } = useWebSocket<{ test: string }>({ key: 'value' })
    return { data }
  },
}

describe('useWebSocket', () => {
  let mockWebSocket: WebSocket

  beforeEach(() => {
    global.WebSocket = vi.fn(() => {
      mockWebSocket = {
        close: vi.fn(),
        onopen: vi.fn(),
        onclose: vi.fn(),
        onerror: vi.fn(),
        onmessage: vi.fn(),
      } as unknown as WebSocket
      return mockWebSocket
    }) as unknown as typeof WebSocket
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('initializes WebSocket and updates data on message', async () => {
    const wrapper = mount({ ...mockedComponent })

    mockWebSocket.onopen?.(new Event('open'))
    expect(mockWebSocket.onopen).toBeTruthy()

    const testMessage = { test: 'hello' }
    const messageEvent = new MessageEvent('message', {
      data: JSON.stringify(testMessage),
    })
    mockWebSocket.onmessage?.(messageEvent)

    expect(wrapper.vm.data).toEqual(testMessage)
  })

  it('handles WebSocket error gracefully', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => { })
    mount({ ...mockedComponent })

    const errorEvent = new Event('error')
    mockWebSocket.onerror?.(errorEvent)

    expect(consoleErrorSpy).toHaveBeenCalled()
    consoleErrorSpy.mockRestore()
  })

  it('closes WebSocket connection on unmount', () => {
    const wrapper = mount({ ...mockedComponent })

    wrapper.unmount()
    expect(mockWebSocket.close).toHaveBeenCalled()
  })
})