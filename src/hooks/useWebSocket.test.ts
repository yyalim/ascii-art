import { mount } from '@vue/test-utils'
import useWebSocket from './useWebSocket'
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'

describe('useWebSocket', () => {
  let mockWebSocket: WebSocket

  beforeEach(() => {
    // Mock the WebSocket constructor
    global.WebSocket = vi.fn(() => {
      mockWebSocket = {
        send: vi.fn(),
        close: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
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
    const wrapper = mount({
      template: '<div></div>',
      setup() {
        const { data } = useWebSocket<{ test: string }>({ key: 'value' })
        return { data }
      },
    })

    // Simulate WebSocket connection opening
    mockWebSocket.onopen?.(new Event('open'))
    expect(mockWebSocket.onopen).toBeTruthy()

    // Simulate receiving a message
    const testMessage = { test: 'hello' }
    const messageEvent = new MessageEvent('message', {
      data: JSON.stringify(testMessage),
    })
    mockWebSocket.onmessage?.(messageEvent)

    // Assert that `data` was updated with the message data
    expect(wrapper.vm.data).toEqual(testMessage)
  })

  it('handles WebSocket error gracefully', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => { })
    mount({
      template: '<div></div>',
      setup() {
        useWebSocket({ key: 'value' })
      },
    })

    // Simulate an error
    const errorEvent = new Event('error')
    mockWebSocket.onerror?.(errorEvent)

    // Check that an error was logged to console
    expect(consoleErrorSpy).toHaveBeenCalled()
    consoleErrorSpy.mockRestore()
  })

  it('closes WebSocket connection on unmount', () => {
    const wrapper = mount({
      template: '<div></div>',
      setup() {
        useWebSocket({ key: 'value' })
      },
    })

    // Check that WebSocket closes on unmount
    wrapper.unmount()
    expect(mockWebSocket.close).toHaveBeenCalled()
  })
})