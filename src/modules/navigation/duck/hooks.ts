import { useCallback, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { useClient, Q, useQuery } from 'cozy-client'
import flag from 'cozy-flags'

import { DEFAULT_SORT, SORT_BY_UPDATE_DATE } from '@/config/sort'
import { RECENT_FOLDER_ID, TRASH_DIR_ID } from '@/constants/config'
import { DOCTYPE_DRIVE_SETTINGS } from '@/lib/doctypes'
import logger from '@/lib/logger'
import { sortFolder, getSort } from '@/modules/navigation/duck'

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

  const dispatch = useDispatch()

  const driveSettingsResult = useQuery(Q(DOCTYPE_DRIVE_SETTINGS), {
    as: DOCTYPE_DRIVE_SETTINGS,
    enabled: flag('drive.settings.save-sort-choice.enabled')
  }) as QueryResult

  const [settingsInit, setsettingsInit] = useState(false)
  if (
    !settingsInit &&
    driveSettingsResult.fetchStatus === 'loaded' &&
    flag('drive.settings.save-sort-choice.enabled')
  ) {
    const settings = driveSettingsResult.data?.[0]?.attributes
    if (settings) {
      dispatch(
        sortFolder(
          folderId,
          settings.attribute || defaultSort.attribute,
          settings.order || defaultSort.order
        )
      )
    }

    setsettingsInit(true)
  }

  const setSortsOrder = useCallback(
    async ({ attribute, order }: Sort) => {
      if (!flag('drive.settings.save-sort-choice.enabled')) {
        logger.warn(
          'Cannot persist sort: flag drive.settings.save-sort-choice.enabled is not enabled'
        )
        return
      }

      dispatch(sortFolder(folderId, attribute, order))

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
    [client, dispatch, folderId, driveSettingsResult.data]
  )

  const currentSort = (useSelector(state => getSort(state)) ||
    defaultSort) as Sort
  return [currentSort, setSortsOrder]
}

export { useFolderSort }
