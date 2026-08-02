/** `String.fromCharCode` is applied per chunk: a whole image at once overflows the call stack. */
const BASE64_CHUNK_SIZE = 0x8000

const DEFAULT_IMAGE_TYPE = 'image/jpeg'

/**
 * Inlines a file as a data URL.
 * Mocks have nowhere to upload photos to, and a `blob:` URL dies with the document,
 * so the exported image travels to the posts mock store as base64 instead.
 * Real uploads replace this once the backend accepts files.
 */
export const fileToDataUrl = async (file: File): Promise<string> => {
  const bytes = new Uint8Array(await file.arrayBuffer())
  let binary = ''

  for (let offset = 0; offset < bytes.length; offset += BASE64_CHUNK_SIZE) {
    binary += String.fromCharCode(...bytes.subarray(offset, offset + BASE64_CHUNK_SIZE))
  }

  return `data:${file.type || DEFAULT_IMAGE_TYPE};base64,${btoa(binary)}`
}
