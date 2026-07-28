export const CREATE_POST_FILTERS = [
  {
    id: 'original',
    label: 'Original',
    cssFilter: 'none',
  },
  {
    id: 'clarendon',
    label: 'Clarendon',
    cssFilter: 'contrast(1.2) saturate(1.35)',
  },
  {
    id: 'gingham',
    label: 'Gingham',
    cssFilter: 'brightness(1.05) contrast(0.95) sepia(0.18)',
  },
  {
    id: 'moon',
    label: 'Moon',
    cssFilter: 'grayscale(1) contrast(1.1) brightness(1.08)',
  },
  {
    id: 'lark',
    label: 'Lark',
    cssFilter: 'brightness(1.08) contrast(0.95) saturate(1.25)',
  },
  {
    id: 'reyes',
    label: 'Reyes',
    cssFilter: 'brightness(1.08) sepia(0.22) saturate(0.85)',
  },
] as const

export type CreatePostFilterId = (typeof CREATE_POST_FILTERS)[number]['id']

export const DEFAULT_CREATE_POST_FILTER_ID: CreatePostFilterId = 'original'

export const getCreatePostFilterCss = (filterId: CreatePostFilterId) =>
  CREATE_POST_FILTERS.find(({ id }) => id === filterId)?.cssFilter ?? 'none'
