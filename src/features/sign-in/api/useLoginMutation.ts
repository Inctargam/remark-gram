import { useMutation } from '@tanstack/react-query'

import { api } from '@/shared/api/baseApi'

type LoginPayload = {
  email: string
  password: string
}

export const useLoginMutation = () =>
  useMutation({
    mutationFn: (payload: LoginPayload) => api.post('/v1/auth/login', payload),
  })
