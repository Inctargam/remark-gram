import { useIsFetching, useIsMutating } from '@tanstack/react-query'
import { useDeferredValue } from 'react'

export const useGlobalLoading = (): boolean => {
  const fetching = useIsFetching()
  const mutating = useIsMutating()
  const active = fetching + mutating > 0

  return useDeferredValue(active)
}
