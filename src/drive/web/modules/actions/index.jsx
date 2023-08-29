import React, { forwardRef } from 'react'

import { isFile } from 'cozy-client/dist/models/file'
import { isIOSApp, isMobileApp } from 'cozy-device-helper'
import Icon from 'cozy-ui/transpiled/react/Icon'
import DownloadIcon from 'cozy-ui/transpiled/react/Icons/Download'
import TrashIcon from 'cozy-ui/transpiled/react/Icons/Trash'
import RenameIcon from 'cozy-ui/transpiled/react/Icons/Rename'
import MovetoIcon from 'cozy-ui/transpiled/react/Icons/Moveto'
import MultiFilesIcon from 'cozy-ui/transpiled/react/Icons/MultiFiles'
import QualifyIcon from 'cozy-ui/transpiled/react/Icons/Qualify'
import HistoryIcon from 'cozy-ui/transpiled/react/Icons/History'
import RestoreIcon from 'cozy-ui/transpiled/react/Icons/Restore'
import ReplyIcon from 'cozy-ui/transpiled/react/Icons/Reply'
import ShareIosIcon from 'cozy-ui/transpiled/react/Icons/ShareIos'
import LinkOutIcon from 'cozy-ui/transpiled/react/Icons/LinkOut'
import EyeIcon from 'cozy-ui/transpiled/react/Icons/Eye'
import ActionsMenuItem from 'cozy-ui/transpiled/react/ActionsMenu/ActionsMenuItem'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import Divider from 'cozy-ui/transpiled/react/Divider'

import { isEncryptedFolder, isEncryptedFile } from 'drive/lib/encryption'
import DeleteConfirm from 'drive/web/modules/drive/DeleteConfirm'
import MakeAvailableOfflineMenuItem from 'drive/web/modules/drive/MakeAvailableOfflineMenuItem'
import DestroyConfirm from 'drive/web/modules/trash/components/DestroyConfirm'
import { startRenamingAsync } from 'drive/web/modules/drive/rename'

import {
  exportFilesNative,
  downloadFiles,
  openFileWith,
  restoreFiles
} from './utils'
import { useI18n } from 'cozy-ui/transpiled/react'
import {
  navigateToModal,
  navigateToModalWithMultipleFile
} from 'drive/web/modules/actions/helpers'

export { share } from './share'

export const download = ({ client, vaultClient }) => {
  return isMobileApp()
    ? {
        name: 'forwardTo',
        icon: 'download',
        displayCondition: files => {
          if (isIOSApp()) return files.length === 1 && isFile(files[0])
          return files.reduce(
            (onlyFiles, file) => onlyFiles && isFile(file),
            true
          )
        },
        action: files =>
          exportFilesNative(client, Array.isArray(files) ? files : [files], {
            vaultClient
          }),
        Component: forwardRef(function Download(props, ref) {
          const { t } = useI18n()
          return (
            <ActionsMenuItem {...props} ref={ref}>
              <ListItemIcon>
                <Icon icon={isIOSApp() ? ShareIosIcon : ReplyIcon} />
              </ListItemIcon>
              <ListItemText primary={t('SelectionBar.forwardTo')} />
            </ActionsMenuItem>
          )
        })
      }
    : {
        name: 'download',
        icon: 'download',
        displayCondition: files => {
          // We cannot generate archive for encrypted files, for now.
          // Then, we do not display the download button when the selection
          // includes an encrypted folder or several encrypted files
          return (
            !files.some(file => isEncryptedFolder(file)) &&
            !(files.length > 1 && files.some(file => isEncryptedFile(file)))
          )
        },
        action: files =>
          downloadFiles(client, Array.isArray(files) ? files : [files], {
            vaultClient
          }),
        Component: forwardRef(function Download(props, ref) {
          const { t } = useI18n()
          return (
            <ActionsMenuItem {...props} ref={ref}>
              <ListItemIcon>
                <Icon icon={DownloadIcon} />
              </ListItemIcon>
              <ListItemText primary={t('SelectionBar.download')} />
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
      return <Divider ref={ref} />
    })
  }
}

export const trash = ({ pushModal, popModal, hasWriteAccess, refresh }) => {
  return {
    name: 'trash',
    icon: 'trash',
    displayCondition: () => hasWriteAccess,
    action: files =>
      pushModal(
        <DeleteConfirm
          files={Array.isArray(files) ? files : [files]}
          afterConfirmation={() => {
            refresh()
          }}
          onClose={popModal}
        />
      ),
    Component: forwardRef(function Trash(props, ref) {
      const { t } = useI18n()
      return (
        <ActionsMenuItem {...props} ref={ref}>
          <ListItemIcon>
            <Icon icon={TrashIcon} color="var(--errorColor)" />
          </ListItemIcon>
          <ListItemText className="u-error" primary={t('SelectionBar.trash')} />
        </ActionsMenuItem>
      )
    })
  }
}
export const open = ({ client, vaultClient }) => {
  return {
    name: 'openWith',
    icon: 'openWith',
    displayCondition: selection =>
      isMobileApp() && selection.length === 1 && isFile(selection[0]),
    action: files =>
      openFileWith(client, Array.isArray(files) ? files[0] : files, {
        vaultClient
      }),
    Component: forwardRef(function Open(props, ref) {
      const { t } = useI18n()
      return (
        <ActionsMenuItem {...props} ref={ref}>
          <ListItemIcon>
            <Icon icon={isIOSApp() ? EyeIcon : LinkOutIcon} />
          </ListItemIcon>
          <ListItemText
            primary={
              isIOSApp()
                ? t('SelectionBar.applePreview')
                : t('SelectionBar.openWith')
            }
          />
        </ActionsMenuItem>
      )
    })
  }
}

export const rename = ({ hasWriteAccess, dispatch }) => {
  return {
    name: 'rename',
    icon: 'rename',
    displayCondition: selection => hasWriteAccess && selection.length === 1,
    action: files =>
      dispatch(startRenamingAsync(Array.isArray(files) ? files[0] : files)),
    Component: forwardRef(function Rename(props, ref) {
      const { t } = useI18n()
      return (
        <ActionsMenuItem {...props} ref={ref}>
          <ListItemIcon>
            <Icon icon={RenameIcon} />
          </ListItemIcon>
          <ListItemText primary={t('SelectionBar.rename')} />
        </ActionsMenuItem>
      )
    })
  }
}

export const move = ({ canMove, pathname, navigate }) => {
  return {
    name: 'moveto',
    icon: 'moveto',
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
      const { t } = useI18n()
      return (
        <ActionsMenuItem {...props} ref={ref}>
          <ListItemIcon>
            <Icon icon={MovetoIcon} />
          </ListItemIcon>
          <ListItemText primary={t('SelectionBar.moveto')} />
        </ActionsMenuItem>
      )
    })
  }
}

export const duplicate = ({ client, hasWriteAccess, refresh, isPublic }) => {
  return {
    name: 'duplicate',
    icon: MultiFilesIcon,
    displayCondition: selection =>
      selection.length === 1 && isFile(selection[0]) && hasWriteAccess,
    action: async files => {
      const file = Array.isArray(files) ? files[0] : files
      await client.collection('io.cozy.files').copy(file.id)
      if (isPublic) refresh()
    },
    Component: forwardRef(function Duplicate(props, ref) {
      const { t } = useI18n()
      return (
        <ActionsMenuItem {...props} ref={ref}>
          <ListItemIcon>
            <Icon icon={MultiFilesIcon} />
          </ListItemIcon>
          <ListItemText primary={t('SelectionBar.duplicate')} />
        </ActionsMenuItem>
      )
    })
  }
}

export const qualify = ({ navigate, pathname }) => {
  return {
    name: 'qualify',
    icon: 'qualify',
    displayCondition: selection =>
      selection.length === 1 && isFile(selection[0]),
    action: files =>
      navigateToModal({ navigate, pathname, files, path: 'qualify' }),
    Component: forwardRef(function Qualify(props, ref) {
      const { t } = useI18n()
      return (
        <ActionsMenuItem {...props} ref={ref}>
          <ListItemIcon>
            <Icon icon={QualifyIcon} />
          </ListItemIcon>
          <ListItemText primary={t('SelectionBar.qualify')} />
        </ActionsMenuItem>
      )
    })
  }
}

export const versions = ({ navigate, pathname }) => {
  return {
    name: 'history',
    icon: 'history',
    displayCondition: selection =>
      selection.length === 1 && isFile(selection[0]),
    action: files =>
      navigateToModal({ navigate, pathname, files, path: 'revision' }),
    Component: forwardRef(function History(props, ref) {
      const { t } = useI18n()
      return (
        <ActionsMenuItem {...props} ref={ref}>
          <ListItemIcon>
            <Icon icon={HistoryIcon} />
          </ListItemIcon>
          <ListItemText primary={t('SelectionBar.history')} />
        </ActionsMenuItem>
      )
    })
  }
}

export const offline = () => {
  return {
    name: 'phone-download',
    icon: 'phone-download',
    displayCondition: selections =>
      isMobileApp() && selections.length === 1 && isFile(selections[0]),
    Component: function MakeAvailableOfflineMenuItemInMenu({ files, ...rest }) {
      return <MakeAvailableOfflineMenuItem file={files[0]} {...rest} />
    }
  }
}

export const restore = ({ refresh, client }) => {
  return {
    name: 'restore',
    icon: 'restore',
    action: async files => {
      await restoreFiles(client, Array.isArray(files) ? files : [files])
      refresh()
    },
    Component: forwardRef(function Restore(props, ref) {
      const { t } = useI18n()
      return (
        <ActionsMenuItem {...props} ref={ref}>
          <ListItemIcon>
            <Icon icon={RestoreIcon} />
          </ListItemIcon>
          <ListItemText primary={t('SelectionBar.restore')} />
        </ActionsMenuItem>
      )
    })
  }
}

export const destroy = ({ pushModal, popModal }) => {
  return {
    name: 'destroy',
    icon: 'trash',
    action: files =>
      pushModal(
        <DestroyConfirm
          files={Array.isArray(files) ? files : [files]}
          onClose={popModal}
        />
      ),
    Component: forwardRef(function Destroy(props, ref) {
      const { t } = useI18n()
      return (
        <ActionsMenuItem {...props} ref={ref}>
          <ListItemIcon>
            <Icon icon={TrashIcon} color="var(--errorColor)" />
          </ListItemIcon>
          <ListItemText
            className="u-error"
            primary={t('SelectionBar.destroy')}
          />
        </ActionsMenuItem>
      )
    })
  }
}
