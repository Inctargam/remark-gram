export const profileQueryKeys = {
  all: ['profile'] as const,
  current: () => [...profileQueryKeys.all, 'current'] as const,
  public: (userId: string) => [...profileQueryKeys.all, 'public', userId] as const,
}
