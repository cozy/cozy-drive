import flag from 'cozy-flags'

import { SETTINGS_DIR_PATH, TRASH_DIR_ID } from '@/constants/config'

export interface FolderContentPartialFilter {
  _id: { $nin: string[] }
  path?: Record<string, unknown>
}

export function getFolderContentPartialFilter(): FolderContentPartialFilter {
  const partialIndexFilters: FolderContentPartialFilter = {
    _id: { $nin: [TRASH_DIR_ID] }
  }

  if (flag('home.wallpaper-personalization.enabled')) {
    partialIndexFilters.path = {
      $or: [{ $exists: false }, { $nin: [SETTINGS_DIR_PATH] }]
    }
  }

  return partialIndexFilters
}
