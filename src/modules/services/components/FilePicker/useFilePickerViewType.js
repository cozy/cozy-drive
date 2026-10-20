import { useCallback, useState } from 'react'

import { FILE_PICKER_VIEW_TYPE_STORAGE_KEY } from './constants'

import {
  filePickerViewTypes,
  DEFAULT_FILE_PICKER_VIEW_TYPE
} from '@/components/FilePicker/constants'

function getStoredPickerViewType() {
  try {
    const stored = window.localStorage.getItem(
      FILE_PICKER_VIEW_TYPE_STORAGE_KEY
    )
    return Object.values(filePickerViewTypes).includes(stored)
      ? stored
      : DEFAULT_FILE_PICKER_VIEW_TYPE
  } catch {
    return DEFAULT_FILE_PICKER_VIEW_TYPE
  }
}

function savePickerViewType(viewType) {
  try {
    window.localStorage.setItem(FILE_PICKER_VIEW_TYPE_STORAGE_KEY, viewType)
  } catch {
    // Storage failures must not prevent switching views in memory.
  }
}

export function useFilePickerViewType() {
  const [viewType, setViewType] = useState(getStoredPickerViewType)
  const handleViewChange = useCallback(nextViewType => {
    if (!Object.values(filePickerViewTypes).includes(nextViewType)) return

    setViewType(nextViewType)
    savePickerViewType(nextViewType)
  }, [])

  return [viewType, handleViewChange]
}
