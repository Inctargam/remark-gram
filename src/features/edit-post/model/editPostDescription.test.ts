import { describe, expect, it } from 'vitest'

import { POST_DESCRIPTION_MAX_LENGTH } from '@/entities/post'

import { isPostDescriptionDirty, preparePostDescription } from './editPostDescription'

describe('isPostDescriptionDirty', () => {
  it('reports an untouched description as clean', () => {
    expect(isPostDescriptionDirty('Trip to the sea', 'Trip to the sea')).toBe(false)
  })

  it('reports an edited description as dirty', () => {
    expect(isPostDescriptionDirty('Trip to the sea', 'Trip to the mountains')).toBe(true)
  })

  it('ignores surrounding whitespace', () => {
    expect(isPostDescriptionDirty('Trip to the sea', '  Trip to the sea  ')).toBe(false)
  })

  it('treats whitespace inside the text as a change', () => {
    expect(isPostDescriptionDirty('Trip to the sea', 'Trip to  the sea')).toBe(true)
  })

  it('reports filling an empty description as dirty', () => {
    expect(isPostDescriptionDirty('', 'First words')).toBe(true)
  })

  it('reports clearing a description as dirty', () => {
    expect(isPostDescriptionDirty('Trip to the sea', '')).toBe(true)
  })

  it('reports replacing a description with spaces as clean when it was empty', () => {
    expect(isPostDescriptionDirty('', '   ')).toBe(false)
  })
})

describe('preparePostDescription', () => {
  it('trims the value sent to the API', () => {
    expect(preparePostDescription('  Trip to the sea \n')).toBe('Trip to the sea')
  })

  it('cuts the value to the limit', () => {
    const overLimit = `${'a'.repeat(POST_DESCRIPTION_MAX_LENGTH)}bbb`

    expect(preparePostDescription(overLimit)).toHaveLength(POST_DESCRIPTION_MAX_LENGTH)
  })

  it('keeps an empty description empty — the field is optional', () => {
    expect(preparePostDescription('   ')).toBe('')
  })
})
