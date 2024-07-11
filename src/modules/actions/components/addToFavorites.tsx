import React, { forwardRef } from 'react'

import { splitFilename } from 'cozy-client/dist/models/file'
import CozyClient from 'cozy-client/types/CozyClient'
import flag from 'cozy-flags'
import { Action } from 'cozy-ui/transpiled/react/ActionsMenu/Actions'
import ActionsMenuItem from 'cozy-ui/transpiled/react/ActionsMenu/ActionsMenuItem'
import Icon from 'cozy-ui/transpiled/react/Icon'
import StarOutlineIcon from 'cozy-ui/transpiled/react/Icons/StarOutline'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'

interface addToFavoritesProps {
  t: (key: string, options?: Record<string, unknown>) => string
  client: CozyClient
  showAlert: import('cozy-ui/transpiled/react/providers/Alert').showAlertFunction
}

const addToFavorites = ({
  t,
  client,
  showAlert
}: addToFavoritesProps): Action => {
  const label = t('favorites.label.add')
  const icon = StarOutlineIcon

  return {
    name: 'addToFavourites',
    label,
    icon,
    displayCondition: docs =>
      docs.length > 0 &&
      docs.every(doc => !doc.cozyMetadata?.favorite) &&
      flag('drive.show-favorites-dev'),
    action: async (files): Promise<void> => {
      try {
        for (const file of files) {
          await client.save({
            ...file,
            cozyMetadata: {
              ...file.cozyMetadata,
              favorite: true
            }
          })
        }

        const { filename } = splitFilename(files[0])
        showAlert({
          message: t('favorites.success.add', {
            filename,
            smart_count: files.length
          }),
          severity: 'success'
        })
      } catch (error) {
        showAlert({ message: t('favorites.error'), severity: 'error' })
      }
    },
    Component: forwardRef(function AddToFavorites(props, ref) {
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

export { addToFavorites }
