import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import AsciiArtViewer from './AsciiArtViewer.vue'
import useWebSocket from '../hooks/useWebSocket'

vi.mock('../hooks/useWebSocket', () => ({
  default: vi.fn(),
}))

describe('WebSocketComponent.vue', () => {
  const mockData = ref<{ percentage: number; line: string } | null>(null)

  beforeEach(() => {
    vi.mocked(useWebSocket).mockReturnValue({ data: mockData })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('displays percentage and updates file content from WebSocket data', async () => {
    const wrapper = mount(AsciiArtViewer, {
      props: {
        fileId: '123',
      },
    })

    expect(wrapper.find('p').text()).toBe('0%')
    expect(wrapper.find('pre').text()).toBe('')

    mockData.value = { percentage: 50, line: 'Hello, ' }
    await wrapper.vm.$nextTick()

    expect(wrapper.find('p').text()).toBe('50%')
    expect(wrapper.find('pre').text()).toBe('Hello,')

    mockData.value = { percentage: 75, line: 'world!' }
    await wrapper.vm.$nextTick()

    expect(wrapper.find('p').text()).toBe('75%')
    expect(wrapper.find('pre').text()).toBe('Hello, world!')
  })
})
