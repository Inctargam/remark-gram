import type { ExportedPostPhoto } from '../lib/exportEditedImage'

export type PublishPostPayload = {
  description: string
  /** Exactly what `exportEditedImage` produces — the flow publishes edited photos as they are. */
  photos: ExportedPostPhoto[]
}

export type PublishPostResult = {
  publicationId: string
}
