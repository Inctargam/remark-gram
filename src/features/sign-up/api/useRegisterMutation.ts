import { useMutation } from '@tanstack/react-query'

import { api } from '@/shared/api/baseApi'

type RegistrationPayload = {
  username: string
  email: string
  password: string
}

export const useRegisterMutation = () =>
  useMutation({
    mutationFn: (payload: RegistrationPayload) => api.post('/v1/auth/registration', payload),
  })
