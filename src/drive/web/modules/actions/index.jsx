import React from 'react'

import { isFile } from 'cozy-client/dist/models/file'
import { ShareModal } from 'cozy-sharing'
import { isIOSApp, isMobileApp } from 'cozy-device-helper'
import { EditDocumentQualification } from 'cozy-scanner'
import { getTracker } from 'cozy-ui/transpiled/react/helpers/tracker'
import { ActionMenuItem } from 'cozy-ui/transpiled/react/ActionMenu'
import Icon from 'cozy-ui/transpiled/react/Icon'
import DownloadIcon from 'cozy-ui/transpiled/react/Icons/Download'
import TrashIcon from 'cozy-ui/transpiled/react/Icons/Trash'
import RenameIcon from 'cozy-ui/transpiled/react/Icons/Rename'
import MovetoIcon from 'cozy-ui/transpiled/react/Icons/Moveto'
import CopyIcon from 'cozy-ui/transpiled/react/Icons/Copy'
import ShareIcon from 'cozy-ui/transpiled/react/Icons/Share'
import PhoneDownloadIcon from 'cozy-ui/transpiled/react/Icons/PhoneDownload'
import QualifyIcon from 'cozy-ui/transpiled/react/Icons/Qualify'
import HistoryIcon from 'cozy-ui/transpiled/react/Icons/History'
import RestoreIcon from 'cozy-ui/transpiled/react/Icons/Restore'
import ReplyIcon from 'cozy-ui/transpiled/react/Icons/Reply'
import ShareIosIcon from 'cozy-ui/transpiled/react/Icons/ShareIos'
import LinkOutIcon from 'cozy-ui/transpiled/react/Icons/LinkOut'
import EyeIcon from 'cozy-ui/transpiled/react/Icons/Eye'

import {
  isEncryptedFolder,
  isEncryptedFile,
  isEncryptedFileOrFolder
} from 'drive/lib/encryption'
import DeleteConfirm from 'drive/web/modules/drive/DeleteConfirm'
import MoveModal from 'drive/web/modules/move/MoveModal'
import ShareMenuItem from 'drive/web/modules/drive/ShareMenuItem'
import MakeAvailableOfflineMenuItem from 'drive/web/modules/drive/MakeAvailableOfflineMenuItem'
import DestroyConfirm from 'drive/web/modules/trash/components/DestroyConfirm'
import { startRenamingAsync } from 'drive/web/modules/drive/rename'

import {
  isAnyFileReferencedByAlbum,
  exportFilesNative,
  downloadFiles,
  openFileWith,
  restoreFiles
} from './utils'
import { useI18n } from 'cozy-ui/transpiled/react'

export const share = ({ hasWriteAccess, pushModal, popModal }) => {
  return {
    icon: ShareIcon,
    displayCondition: selection =>
      hasWriteAccess &&
      selection.length === 1 &&
      !isEncryptedFileOrFolder(selection[0]),
    action: selected =>
      pushModal(
        <ShareModal
          document={selected[0]}
          documentType="Files"
          sharingDesc={selected[0].name}
          onClose={popModal}
        />
      ),
    Component: function ShareMenuItemInMenu({ files, ...rest }) {
      return <ShareMenuItem docId={files[0].id} {...rest} />
    }
  }
}

export const download = ({ client, vaultClient }) => {
  return isMobileApp()
    ? {
        icon: isIOSApp() ? ShareIosIcon : ReplyIcon,
        label: 'forwardTo',
        displayCondition: files => {
          if (isIOSApp()) return files.length === 1 && isFile(files[0])
          return files.reduce(
            (onlyFiles, file) => onlyFiles && isFile(file),
            true
          )
        },
        action: files => exportFilesNative(client, files, { vaultClient }),
        Component: function Download(props) {
          const { t } = useI18n()
          return (
            <ActionMenuItem
              onClick={props.onClick}
              left={<Icon icon={props.icon} />}
            >
              {t('SelectionBar.' + props.label)}
            </ActionMenuItem>
          )
        }
      }
    : {
        icon: DownloadIcon,
        label: 'download',
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
        Component: function Download(props) {
          const { t } = useI18n()
          return (
            <ActionMenuItem
              onClick={props.onClick}
              left={<Icon icon={props.icon} />}
            >
              {t('SelectionBar.' + props.label)}
            </ActionMenuItem>
          )
        }
      }
}

export const hr = () => {
  return {
    displayInSelectionBar: false,
    Component: function hr() {
      return <hr />
    }
  }
}

export const trash = ({ pushModal, popModal, hasWriteAccess, refresh }) => {
  return {
    icon: TrashIcon,
    label: 'trash',
    displayCondition: () => hasWriteAccess,
    action: files =>
      pushModal(
        <DeleteConfirm
          files={files}
          referenced={isAnyFileReferencedByAlbum(files)}
          afterConfirmation={() => {
            refresh()
          }}
          onClose={popModal}
        />
      ),
    Component: function Trash(props) {
      const { t } = useI18n()
      return (
        <ActionMenuItem
          onClick={props.onClick}
          left={<Icon icon={props.icon} color="var(--errorColor)" />}
        >
          <span className="u-error">{t('SelectionBar.' + props.label)}</span>
        </ActionMenuItem>
      )
    }
  }
}
export const open = ({ client, vaultClient }) => {
  return {
    icon: isIOSApp() ? EyeIcon : LinkOutIcon,
    label: isIOSApp() ? 'applePreview' : 'openWith',
    displayCondition: selection =>
      isMobileApp() && selection.length === 1 && isFile(selection[0]),
    action: files => openFileWith(client, files[0], { vaultClient }),
    Component: function Open(props) {
      const { t } = useI18n()
      return (
        <ActionMenuItem
          onClick={props.onClick}
          left={<Icon icon={props.icon} />}
        >
          {t('SelectionBar.' + props.label)}
        </ActionMenuItem>
      )
    }
  }
}

export const rename = ({ hasWriteAccess, dispatch }) => {
  return {
    icon: RenameIcon,
    label: 'rename',
    displayCondition: selection => hasWriteAccess && selection.length === 1,
    action: files => dispatch(startRenamingAsync(files[0])),
    Component: function Rename(props) {
      const { t } = useI18n()
      return (
        <ActionMenuItem
          onClick={props.onClick}
          left={<Icon icon={props.icon} />}
        >
          {t('SelectionBar.' + props.label)}
        </ActionMenuItem>
      )
    }
  }
}

export const move = ({ canMove, pushModal, popModal }) => {
  return {
    icon: MovetoIcon,
    label: 'moveto',
    displayCondition: () => canMove,
    action: files =>
      pushModal(<MoveModal entries={files} onClose={popModal} />),
    Component: function MoveTo(props) {
      const { t } = useI18n()
      return (
        <ActionMenuItem
          onClick={props.onClick}
          left={<Icon icon={props.icon} />}
        >
          {t('SelectionBar.' + props.label)}
        </ActionMenuItem>
      )
    }
  }
}

export const copy = ({ client, hasWriteAccess, refresh, isPublic }) => {
  return {
    icon: CopyIcon,
    label: 'copy',
    displayCondition: selection =>
      selection.length === 1 && isFile(selection[0]) && hasWriteAccess,
    action: async files => {
      await client.collection('io.cozy.files').copy(files[0].id)
      if (isPublic) refresh()
    },
    Component: function Copy(props) {
      const { t } = useI18n()
      return (
        <ActionMenuItem onClick={props.onClick} left={<Icon icon={props.icon} />}>
          {t('SelectionBar.' + props.label)}
        </ActionMenuItem>
      )
    }
  }
}

export const qualify = ({ pushModal, popModal }) => {
  return {
    icon: QualifyIcon,
    label: 'qualify',
    displayCondition: selection =>
      selection.length === 1 && isFile(selection[0]),
    action: files =>
      pushModal(
        <EditDocumentQualification document={files[0]} onClose={popModal} />
      ),
    Component: function Qualify(props) {
      const { t } = useI18n()
      return (
        <ActionMenuItem
          onClick={props.onClick}
          left={<Icon icon={props.icon} />}
        >
          {t('SelectionBar.' + props.label)}
        </ActionMenuItem>
      )
    }
  }
}

export const versions = ({ router, location }) => {
  return {
    icon: HistoryIcon,
    label: 'history',
    displayCondition: selection =>
      selection.length === 1 && isFile(selection[0]),
    action: files => {
      const tracker = getTracker()
      if (tracker) {
        tracker.push(['trackEvent', 'Drive', 'Versioning', 'ClickFromMenuFile'])
      }
      return router.push(`${location.pathname}/file/${files[0].id}/revision`)
    },
    Component: function History(props) {
      const { t } = useI18n()
      return (
        <ActionMenuItem
          onClick={props.onClick}
          left={<Icon icon={props.icon} />}
        >
          {t('SelectionBar.' + props.label)}
        </ActionMenuItem>
      )
    }
  }


export const offline = () => {
  return {
    icon: PhoneDownloadIcon,
    displayCondition: selections =>
      isMobileApp() && selections.length === 1 && isFile(selections[0]),
    Component: function MakeAvailableOfflineMenuItemInMenu({ files, ...rest }) {
      return <MakeAvailableOfflineMenuItem file={files[0]} {...rest} />
    }
  }
}

export const restore = ({ refresh, client }) => {
  return {
    icon: RestoreIcon,
    label: 'restore',
    action: async files => {
      await restoreFiles(client, files)
      refresh()
    },
    Component: function Restore(props) {
      const { t } = useI18n()
      return (
        <ActionMenuItem
          onClick={props.onClick}
          left={<Icon icon={props.icon} />}
        >
          {t('SelectionBar.' + props.label)}
        </ActionMenuItem>
      )
    }
  }
}

export const destroy = ({ pushModal, popModal }) => {
  return {
    icon: TrashIcon,
    label: 'destroy',
    action: files =>
      pushModal(<DestroyConfirm files={files} onClose={popModal} />),
    Component: function Destroy(props) {
      const { t } = useI18n()
      return (
        <ActionMenuItem
          onClick={props.onClick}
          left={<Icon icon={props.icon} color="var(--errorColor)" />}
        >
          <span className="u-error">{t('SelectionBar.' + props.label)}</span>
        </ActionMenuItem>
      )
    }
  }
}
