import { API_BASE_URL } from '@/shared/config'

export const getProfileAvatarUrl = (avatarFileId: string | null | undefined): string | null =>
  avatarFileId ? `${API_BASE_URL}/api/v1/files/images/${avatarFileId}` : null
