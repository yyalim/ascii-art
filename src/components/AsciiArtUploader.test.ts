import { mount } from '@vue/test-utils'
import AsciiArtUploader from './AsciiArtUploader.vue'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { createUpload } from '../api'

vi.mock('../api/', () => ({
  createUpload: vi.fn(),
}))

describe('AsciiArtUploader.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('calls createUpload and emits "update:modelValue" on successful form submission', async () => {
    const mockFileId = '12345'
    vi.mocked(createUpload).mockResolvedValue({ fileId: mockFileId })

    const wrapper = mount(AsciiArtUploader, {
      props: {
        modelValue: '',
      },
    })

    await wrapper.find('form').trigger('submit.prevent')

    expect(createUpload).toHaveBeenCalledOnce()
    expect(createUpload).toHaveBeenCalledWith(expect.any(FormData))

    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')![1][0]).toBe(mockFileId)
  })

  it('log an error message on failed form submission', async () => {
    const consoleLogSpy = vi.spyOn(console, 'error').mockImplementation(() => { })
    vi.mocked(createUpload).mockRejectedValue(new Error('Failed to upload file'))

    const wrapper = mount(AsciiArtUploader, {
      props: {
        modelValue: '',
      },
    })

    await wrapper.find('form').trigger('submit.prevent')

    expect(createUpload).toHaveBeenCalledOnce()
    expect(createUpload).toHaveBeenCalledWith(expect.any(FormData))

    expect(consoleLogSpy).toHaveBeenCalled()
    expect(consoleLogSpy).toHaveBeenCalledWith(new Error('Failed to upload file'))
  })
})
