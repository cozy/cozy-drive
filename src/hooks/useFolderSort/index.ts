import { useCallback, useEffect, useState } from 'react'

import { useClient, Q } from 'cozy-client'
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

const useFolderSort = (
  folderId: string
): [Sort, (props: Sort) => void, boolean] => {
  const defaultSort: Sort =
    folderId === TRASH_DIR_ID || folderId === RECENT_FOLDER_ID
      ? SORT_BY_UPDATE_DATE
      : DEFAULT_SORT

  const client = useClient()
  const [currentSettings, setCurrentSettings] = useState(defaultSort)
  const [isSettingsLoaded, setIsSettingsLoaded] = useState(false)

  useEffect(() => {
    const load = async (): Promise<void> => {
      if (!client || !flag('drive.save-sort-choice.enabled')) return

      try {
        const result = (await client.query(
          Q(DOCTYPE_DRIVE_SETTINGS)
        )) as QueryResult

        if (!result.data) return

        setCurrentSettings(result.data[0]?.attributes)
      } catch (error) {
        logger.error('Failed to load settings:', error)
        setCurrentSettings(defaultSort)
      } finally {
        setIsSettingsLoaded(true)
      }
    }

    void load()
  }, [client, defaultSort, setCurrentSettings])

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
        const settingsToSave: DriveSettings = {
          _type: DOCTYPE_DRIVE_SETTINGS,
          attributes: {
            ...currentSettings,
            attribute,
            order
          }
        }

        await client.save(settingsToSave)
        logger.info('Sort settings persisted', { attribute, order })
      } catch (error) {
        logger.error('Failed to save sorting preference:', error)
      }
    },
    [client, currentSettings]
  )

  return [currentSettings, setSortOrder, isSettingsLoaded]
}

export { useFolderSort }
