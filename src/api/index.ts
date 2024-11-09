import type { UploadResponse } from "../types/UploadResponse"

export async function createUpload(formData: FormData): Promise<UploadResponse> {
  const response = await fetch(import.meta.env.VITE_HTTP_URL + '/upload', {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    throw new Error('Failed to upload file')
  }

  return response.json()
}
