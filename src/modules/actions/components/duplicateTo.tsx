import React, { forwardRef } from 'react'

import { isFile } from 'cozy-client/dist/models/file'
import { Action } from 'cozy-ui/transpiled/react/ActionsMenu/Actions'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'
import ActionsMenuItem from 'cozy-ui/transpiled/react/ActionsMenu/ActionsMenuItem'
import Icon from 'cozy-ui/transpiled/react/Icon'
import MultiFilesIcon from 'cozy-ui/transpiled/react/Icons/MultiFiles'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'

import { navigateToModalWithMultipleFile } from '../helpers'

interface duplicateToProps {
  t: (key: string, options?: Record<string, unknown>) => string
  navigate: (to: string) => void
  pathname: string
  search?: string
}

const duplicateTo = ({
  t,
  pathname,
  navigate,
  search
}: duplicateToProps): Action => {
  const label = t('actions.duplicateTo.label')
  const icon = MultiFilesIcon

  return {
    name: 'duplicateTo',
    label,
    icon,
    displayCondition: docs => docs.length === 1 && isFile(docs[0]),
    action: (files): void => {
      navigateToModalWithMultipleFile({
        files,
        pathname,
        navigate,
        path: 'duplicate',
        search
      })
    },
    Component: forwardRef(function DuplicateTo(props, ref) {
      const { isMobile } = useBreakpoints()
      const actionLabel = isMobile
        ? t('actions.duplicateToMobile.label')
        : t('actions.duplicateTo.label')

      return (
        <ActionsMenuItem {...props} ref={ref}>
          <ListItemIcon>
            <Icon icon={icon} />
          </ListItemIcon>
          <ListItemText primary={actionLabel} />
        </ActionsMenuItem>
      )
    })
  }
}

export { duplicateTo }
