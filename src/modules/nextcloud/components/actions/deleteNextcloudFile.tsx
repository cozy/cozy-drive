import React, { forwardRef } from 'react'

import { NextcloudFile } from 'cozy-client/types/types'
import flag from 'cozy-flags'
import ActionsMenuItem from 'cozy-ui/transpiled/react/ActionsMenu/ActionsMenuItem'
import Icon from 'cozy-ui/transpiled/react/Icon'
import TrashIcon from 'cozy-ui/transpiled/react/Icons/Trash'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'

import { navigateToModalWithMultipleFile } from 'modules/actions/helpers'

interface DeleteNextcloudFileProps {
  t: (key: string) => string
  pathname: string
  navigate: (path: string) => void
  search: string
}

interface ActionsMenuItemProps {
  name: string
  label: string
  icon: React.ReactNode
  action: (files: never[]) => void
  disabled: () => boolean
  Component: React.ReactNode
}

/**
 * Deletes a Nextcloud file.
 *
 * @param t - The translation function.
 * @param pathname - The current pathname.
 * @param navigate - The navigation function.
 * @param search - The current search string.
 * @returns An actions menu item to delete a Nextcloud file
 */
export const deleteNextcloudFile = ({
  t,
  pathname,
  navigate,
  search
}: DeleteNextcloudFileProps): ActionsMenuItemProps => {
  const label = t('SelectionBar.trash')
  const icon = TrashIcon

  return {
    name: 'deleteNextcloudFile',
    label,
    icon,
    action: (files: NextcloudFile[]): void => {
      navigateToModalWithMultipleFile({
        files,
        pathname,
        navigate,
        path: 'delete',
        search
      })
    },
    disabled: () => !flag('drive.show-nextcloud-delete-dev'),
    Component: forwardRef(function DeleteNextcloudFile(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      props: any,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref: React.Ref<any>
    ) {
      return (
        <ActionsMenuItem {...props} ref={ref}>
          <ListItemIcon>
            <Icon icon={icon} color="var(--errorColor)" />
          </ListItemIcon>
          <ListItemText
            primary={label}
            primaryTypographyProps={{ color: 'error' }}
          />
        </ActionsMenuItem>
      )
    })
  }
}
