export type PublishPostPayload = {
  description: string
  photos: File[]
}

export type PublishPostResult = {
  publicationId: string
}

export const publishPostMock = async (_payload: PublishPostPayload): Promise<PublishPostResult> => {
  await new Promise((resolve) => {
    setTimeout(resolve, 400)
  })

  return { publicationId: crypto.randomUUID() }
}
