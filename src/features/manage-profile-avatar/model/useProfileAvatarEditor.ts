import { useEffect, useState } from 'react'
import type { Area, Point } from 'react-easy-crop'

import { DEFAULT_PROFILE_AVATAR_CROP, DEFAULT_PROFILE_AVATAR_ZOOM } from './profileAvatarCrop'

type EditorState = {
  selectedFile: File | null
  previewUrl: string | null
  crop: Point
  zoom: number
  croppedAreaPixels: Area | null
}

const INITIAL_EDITOR_STATE: EditorState = {
  selectedFile: null,
  previewUrl: null,
  crop: DEFAULT_PROFILE_AVATAR_CROP,
  zoom: DEFAULT_PROFILE_AVATAR_ZOOM,
  croppedAreaPixels: null,
}

export const useProfileAvatarEditor = () => {
  const [state, setState] = useState(INITIAL_EDITOR_STATE)
  const { previewUrl } = state

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  const resetEditor = () => {
    setState(INITIAL_EDITOR_STATE)
  }

  const selectFile = (file: File) => {
    setState({
      ...INITIAL_EDITOR_STATE,
      selectedFile: file,
      previewUrl: URL.createObjectURL(file),
    })
  }

  const cropChangeHandler = (nextCrop: Point) => {
    const cropChanged = nextCrop.x !== state.crop.x || nextCrop.y !== state.crop.y
    if (cropChanged) {
      setState((previousState) => ({ ...previousState, crop: nextCrop, croppedAreaPixels: null }))
    }
    return cropChanged
  }

  const zoomChangeHandler = (nextZoom: number) => {
    const zoomChanged = nextZoom !== state.zoom
    if (zoomChanged) {
      setState((previousState) => ({ ...previousState, zoom: nextZoom, croppedAreaPixels: null }))
    }
    return zoomChanged
  }

  const cropCompleteHandler = (nextCroppedAreaPixels: Area) => {
    const { croppedAreaPixels } = state
    const cropChanged =
      !croppedAreaPixels ||
      (['x', 'y', 'width', 'height'] as const).some(
        (dimension) => croppedAreaPixels[dimension] !== nextCroppedAreaPixels[dimension]
      )

    setState((previousState) => ({ ...previousState, croppedAreaPixels: nextCroppedAreaPixels }))
    return cropChanged
  }

  return {
    ...state,
    resetEditor,
    selectFile,
    cropChangeHandler,
    zoomChangeHandler,
    cropCompleteHandler,
  }
}
