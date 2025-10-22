import { useCallback } from 'react'

import { useClient, Q, useQuery } from 'cozy-client'
import flag from 'cozy-flags'

import { DEFAULT_SORT, SORT_BY_UPDATE_DATE } from '@/config/sort'
import { RECENT_FOLDER_ID, TRASH_DIR_ID } from '@/constants/config'
import { DOCTYPE_DRIVE_SETTINGS } from '@/lib/doctypes'
import logger from '@/lib/logger'

export interface Sort {
  attribute: string
  order: string
}

interface DriveSettings {
  _type?: string
  attributes: Sort
}

interface QueryResult {
  data?: DriveSettings[]
  fetchStatus?: string
}

const useFolderSort = (folderId: string): [Sort, (props: Sort) => void] => {
  const client = useClient()

  const defaultSort: Sort =
    folderId === TRASH_DIR_ID || folderId === RECENT_FOLDER_ID
      ? SORT_BY_UPDATE_DATE
      : DEFAULT_SORT

  const driveSettingsResult = useQuery(Q(DOCTYPE_DRIVE_SETTINGS), {
    as: DOCTYPE_DRIVE_SETTINGS,
    enabled: flag('drive.save-sort-choice.enabled')
  }) as QueryResult

  const settings = driveSettingsResult.data?.[0]?.attributes
  const currentSort =
    driveSettingsResult.fetchStatus === 'loaded' &&
    flag('drive.save-sort-choice.enabled') &&
    settings
      ? settings
      : defaultSort

  const setSortOrder = useCallback(
    async ({ attribute, order }: Sort) => {
      if (!flag('drive.save-sort-choice.enabled')) {
        logger.warn(
          'Cannot persist sort: flag drive.save-sort-choice.enabled is not enabled'
        )
        return
      }

      if (!client) {
        logger.warn('Cannot persist sort: client unavailable')
        return
      }

      try {
        const existingSettings = driveSettingsResult.data?.[0]

        const settingsToSave: DriveSettings = existingSettings
          ? {
              ...existingSettings,
              attributes: { attribute, order }
            }
          : {
              _type: DOCTYPE_DRIVE_SETTINGS,
              attributes: { attribute, order }
            }

        await client.save(settingsToSave)
        logger.info('Sort settings persisted', { attribute, order })
      } catch (error) {
        logger.error('Failed to save sorting preference:', error)
      }
    },
    [client, driveSettingsResult.data]
  )

  return [currentSort, setSortOrder]
}

export { useFolderSort }
