import React, { forwardRef } from 'react'

import { getQualification } from 'cozy-client/dist/models/document'
import { getBoundT } from 'cozy-client/dist/models/document/locales'
import { isFile } from 'cozy-client/dist/models/file'
import ActionsMenuItem from 'cozy-ui/transpiled/react/ActionsMenu/ActionsMenuItem'
import Divider from 'cozy-ui/transpiled/react/Divider'
import Icon from 'cozy-ui/transpiled/react/Icon'
import DownloadIcon from 'cozy-ui/transpiled/react/Icons/Download'
import HistoryIcon from 'cozy-ui/transpiled/react/Icons/History'
import MovetoIcon from 'cozy-ui/transpiled/react/Icons/Moveto'
import MultiFilesIcon from 'cozy-ui/transpiled/react/Icons/MultiFiles'
import QualifyIcon from 'cozy-ui/transpiled/react/Icons/Qualify'
import RenameIcon from 'cozy-ui/transpiled/react/Icons/Rename'
import RestoreIcon from 'cozy-ui/transpiled/react/Icons/Restore'
import TrashIcon from 'cozy-ui/transpiled/react/Icons/Trash'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'

import { downloadFiles, restoreFiles } from './utils'
import { isEncryptedFolder, isEncryptedFile } from 'lib/encryption'
import {
  navigateToModal,
  navigateToModalWithMultipleFile
} from 'modules/actions/helpers'
import DeleteConfirm from 'modules/drive/DeleteConfirm'
import { startRenamingAsync } from 'modules/drive/rename'
import DestroyConfirm from 'modules/trash/components/DestroyConfirm'

export { share } from './share'

export const download = ({ client, t, vaultClient }) => {
  const label = t('SelectionBar.download')
  const icon = DownloadIcon

  return {
    name: 'download',
    label,
    icon,
    displayCondition: files => {
      // We cannot generate archive for encrypted files, for now.
      // Then, we do not display the download button when the selection
      // includes an encrypted folder or several encrypted files
      return (
        !files.some(file => isEncryptedFolder(file)) &&
        !(files.length > 1 && files.some(file => isEncryptedFile(file)))
      )
    },
    action: files => downloadFiles(client, files, { vaultClient }),
    Component: forwardRef(function Download(props, ref) {
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

export const hr = () => {
  return {
    name: 'hr',
    icon: 'hr',
    displayInSelectionBar: false,
    Component: forwardRef(function hr(props, ref) {
      return <Divider ref={ref} className="u-mv-half" />
    })
  }
}

export const trash = ({ t, pushModal, popModal, hasWriteAccess, refresh }) => {
  const label = t('SelectionBar.trash')
  const icon = TrashIcon

  return {
    name: 'trash',
    label,
    icon,
    displayCondition: () => hasWriteAccess,
    action: files =>
      pushModal(
        <DeleteConfirm
          files={files}
          afterConfirmation={() => {
            refresh()
          }}
          onClose={popModal}
        />
      ),
    Component: forwardRef(function Trash(props, ref) {
      return (
        <ActionsMenuItem {...props} ref={ref}>
          <ListItemIcon>
            <Icon icon={icon} color="var(--errorColor)" />
          </ListItemIcon>
          <ListItemText className="u-error" primary={label} />
        </ActionsMenuItem>
      )
    })
  }
}

export const rename = ({ t, hasWriteAccess, dispatch }) => {
  const label = t('SelectionBar.rename')
  const icon = RenameIcon

  return {
    name: 'rename',
    label,
    icon,
    displayCondition: selection => hasWriteAccess && selection.length === 1,
    action: files => dispatch(startRenamingAsync(files[0])),
    Component: forwardRef(function Rename(props, ref) {
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

export const move = ({ t, canMove, pathname, navigate }) => {
  const label = t('SelectionBar.moveto')
  const icon = MovetoIcon

  return {
    name: 'moveto',
    label,
    icon,
    displayCondition: () => canMove,
    action: files => {
      navigateToModalWithMultipleFile({
        files,
        pathname,
        navigate,
        path: 'move'
      })
    },
    Component: forwardRef(function MoveTo(props, ref) {
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

export const duplicate = ({ client, t, hasWriteAccess, refresh, isPublic }) => {
  const label = t('SelectionBar.duplicate')
  const icon = MultiFilesIcon

  return {
    name: 'duplicate',
    label,
    icon,
    displayCondition: selection => {
      return selection.length === 1 && isFile(selection[0]) && hasWriteAccess
    },
    action: async files => {
      const file = files[0]
      await client.collection('io.cozy.files').copy(file.id)
      if (isPublic) refresh()
    },
    Component: forwardRef(function Duplicate(props, ref) {
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

export const qualify = ({ t, lang, navigate, pathname }) => {
  const label = t('SelectionBar.qualify')
  const scannerT = getBoundT(lang || 'en')

  return {
    name: 'qualify',
    label,
    icon,
    displayCondition: selection =>
      selection.length === 1 && isFile(selection[0]),
    action: files =>
      navigateToModal({ navigate, pathname, files, path: 'qualify' }),
    Component: forwardRef(function Qualify(props, ref) {
      const file = props.docs[0]
      const fileQualif = getQualification(file)

      return (
        <ActionsMenuItem {...props} ref={ref}>
          <ListItemIcon>
            <Icon icon={icon} />
          </ListItemIcon>
          <ListItemText primary={fileQualif ? t('Scan.requalify') : label} />
          {fileQualif && (
            <ListItemText
              secondary={scannerT(`Scan.items.${fileQualif.label}`)}
              secondaryTypographyProps={{ variant: 'caption' }}
              className="u-ta-right"
            />
          )}
        </ActionsMenuItem>
      )
    })
  }
}

export const versions = ({ t, navigate, pathname }) => {
  const label = t('SelectionBar.history')
  const icon = HistoryIcon

  return {
    name: 'history',
    label,
    icon,
    displayCondition: selection =>
      selection.length === 1 && isFile(selection[0]),
    action: files =>
      navigateToModal({ navigate, pathname, files, path: 'revision' }),
    Component: forwardRef(function History(props, ref) {
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

export const restore = ({ t, refresh, client }) => {
  const label = t('SelectionBar.restore')
  const icon = RestoreIcon

  return {
    name: 'restore',
    label,
    icon,
    action: async files => {
      await restoreFiles(client, files)
      refresh()
    },
    Component: forwardRef(function Restore(props, ref) {
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

export const destroy = ({ t, pushModal, popModal }) => {
  const label = t('SelectionBar.destroy')
  const icon = TrashIcon

  return {
    name: 'destroy',
    label,
    icon,
    action: files =>
      pushModal(
        <DestroyConfirm
          files={files}
          onConfirm={popModal}
          onCancel={popModal}
        />
      ),
    Component: forwardRef(function Destroy(props, ref) {
      return (
        <ActionsMenuItem {...props} ref={ref}>
          <ListItemIcon>
            <Icon icon={icon} color="var(--errorColor)" />
          </ListItemIcon>
          <ListItemText className="u-error" primary={label} />
        </ActionsMenuItem>
      )
    })
  }
}
