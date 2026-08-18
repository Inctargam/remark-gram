import { createPost } from '@/entities/post'

import { fileToDataUrl } from '../lib/fileToDataUrl'
import type { PublishPostPayload, PublishPostResult } from './publishPostTypes'

/**
 * Publishes into the shared posts mock (`/api/mock/posts`) — the same store the profile grid
 * reads, so a created post shows up there right away.
 * Photos are not uploaded anywhere on mocks: every edited file is inlined as a data URL.
 */
export const publishPostMock = async ({
  description,
  photos,
}: PublishPostPayload): Promise<PublishPostResult> => {
  const images = await Promise.all(
    photos.map(async ({ file, width, height }) => ({
      url: await fileToDataUrl(file),
      width,
      height,
    }))
  )

  const post = await createPost({ description, images })

  return { publicationId: post.id }
}
