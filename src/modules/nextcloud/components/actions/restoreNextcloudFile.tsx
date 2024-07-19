import React, { forwardRef } from 'react'

import CozyClient from 'cozy-client/types/CozyClient'
import { NextcloudFile } from 'cozy-client/types/types'
import { Action } from 'cozy-ui/transpiled/react/ActionsMenu/Actions'
import ActionsMenuItem from 'cozy-ui/transpiled/react/ActionsMenu/ActionsMenuItem'
import Icon from 'cozy-ui/transpiled/react/Icon'
import RestoreIcon from 'cozy-ui/transpiled/react/Icons/Restore'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'

import { getParentPath } from 'lib/path'
import { computeNextcloudFolderQueryId } from 'modules/nextcloud/helpers'

interface RestoreNextcloudFileProps {
  t: (key: string) => string
  client: CozyClient
  showAlert: import('cozy-ui/transpiled/react/providers/Alert').showAlertFunction
}

export const restoreNextcloudFile = ({
  t,
  client,
  showAlert
}: RestoreNextcloudFileProps): Action => {
  const label = t('RestoreNextcloudFile.label')
  const icon = RestoreIcon

  return {
    name: 'restoreNextcloudFile',
    label,
    icon,
    displayCondition: (files): boolean => files.length > 0,
    action: async (docs): Promise<void> => {
      const files = docs as unknown as NextcloudFile[]
      try {
        for (const file of files) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
          await client
            .collection('io.cozy.remote.nextcloud.files')
            .restore(file)
        }
        const sourceAccount = files[0].cozyMetadata.sourceAccount
        const restorePaths = files
          .map(file =>
            file.restore_path ? getParentPath(file.restore_path) : undefined
          )
          .filter(Boolean)
        const uniqueRestorePaths = Array.from(new Set(restorePaths))
        for (const path of uniqueRestorePaths) {
          const queryId = computeNextcloudFolderQueryId({
            sourceAccount,
            path
          })
          await client.resetQuery(queryId)
        }
        showAlert({
          message: t('RestoreNextcloudFile.success'),
          severity: 'success'
        })
      } catch (error) {
        showAlert({
          message: t('RestoreNextcloudFile.error'),
          severity: 'error'
        })
      }
    },
    Component: forwardRef(function RestoreNextcloudFile(props, ref) {
      return (
        <ActionsMenuItem {...props} ref={ref}>
          <ListItemIcon>
            <Icon icon={icon} />
          </ListItemIcon>
          <ListItemText primary={label} />
        </ActionsMenuItem>
      )
    })
  }
}
