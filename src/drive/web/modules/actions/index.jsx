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
import QualifyIcon from 'cozy-ui/transpiled/react/Icons/Qualify'
import HistoryIcon from 'cozy-ui/transpiled/react/Icons/History'
import RestoreIcon from 'cozy-ui/transpiled/react/Icons/Restore'
import ReplyIcon from 'cozy-ui/transpiled/react/Icons/Reply'
import ShareIosIcon from 'cozy-ui/transpiled/react/Icons/ShareIos'
import LinkOutIcon from 'cozy-ui/transpiled/react/Icons/LinkOut'
import EyeIcon from 'cozy-ui/transpiled/react/Icons/Eye'

import { hasEncryptionRef } from 'drive/lib/encryption'
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
    icon: 'share',
    displayCondition: selection => hasWriteAccess && selection.length === 1,
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
        icon: 'download',
        displayCondition: files => {
          if (isIOSApp()) return files.length === 1 && isFile(files[0])
          return files.reduce(
            (onlyFiles, file) => onlyFiles && isFile(file),
            true
          )
        },
        action: files => exportFilesNative(client, files),
        label: 'forwardTo',
        Component: function Download(props) {
          const { t } = useI18n()
          return (
            <ActionMenuItem
              onClick={() => {
                return exportFilesNative(client, props.files)
              }}
              left={<Icon icon={isIOSApp() ? ShareIosIcon : ReplyIcon} />}
            >
              {t('SelectionBar.forwardTo')}
            </ActionMenuItem>
          )
        }
      }
    : {
        icon: 'download',
        displayCondition: files => {
          // Do not display if an encrypted folder is selected
          return !files.find(file => hasEncryptionRef(file))
        },
        action: files => downloadFiles(client, files, { vaultClient }),
        Component: function Download(props) {
          const { t } = useI18n()
          return (
            <ActionMenuItem
              onClick={() => {
                return downloadFiles(client, props.files, { vaultClient })
              }}
              left={<Icon icon={DownloadIcon} />}
            >
              {t('SelectionBar.download')}
            </ActionMenuItem>
          )
        }
      }
}

export const hr = () => {
  return {
    icon: 'hr',
    displayInSelectionBar: false,
    Component: function hr() {
      return <hr />
    }
  }
}

export const trash = ({ pushModal, popModal, hasWriteAccess, refresh }) => {
  return {
    icon: 'trash',
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
          onClick={() =>
            pushModal(
              <DeleteConfirm
                files={props.files}
                referenced={isAnyFileReferencedByAlbum(props.files)}
                afterConfirmation={() => {
                  refresh()
                }}
                onClose={popModal}
              />
            )
          }
          left={<Icon icon={TrashIcon} color="var(--errorColor)" />}
        >
          <span className="u-error">{t('SelectionBar.trash')}</span>
        </ActionMenuItem>
      )
    }
  }
}
export const open = ({ client }) => {
  return {
    icon: 'openWith',
    displayCondition: selection =>
      isMobileApp() && selection.length === 1 && isFile(selection[0]),
    action: files => openFileWith(client, files[0]),
    Component: function Open(props) {
      const { t } = useI18n()
      return (
        <ActionMenuItem
          onClick={() => openFileWith(client, props.files[0])}
          left={<Icon icon={isIOSApp() ? EyeIcon : LinkOutIcon} />}
        >
          {isIOSApp()
            ? t('SelectionBar.applePreview')
            : t('SelectionBar.openWith')}
        </ActionMenuItem>
      )
    }
  }
}

export const rename = ({ hasWriteAccess, dispatch }) => {
  return {
    icon: 'rename',
    displayCondition: selection => hasWriteAccess && selection.length === 1,
    action: files => dispatch(startRenamingAsync(files[0])),
    Component: function Rename(props) {
      const { t } = useI18n()
      return (
        <ActionMenuItem
          onClick={() => dispatch(startRenamingAsync(props.files[0]))}
          left={<Icon icon={RenameIcon} />}
        >
          {t('SelectionBar.rename')}
        </ActionMenuItem>
      )
    }
  }
}

export const move = ({ canMove, pushModal, popModal }) => {
  return {
    icon: 'moveto',
    displayCondition: () => canMove,
    action: files =>
      pushModal(<MoveModal entries={files} onClose={popModal} />),
    Component: function MoveTo(props) {
      const { t } = useI18n()
      return (
        <ActionMenuItem
          onClick={() =>
            pushModal(<MoveModal entries={props.files} onClose={popModal} />)
          }
          left={<Icon icon={MovetoIcon} />}
        >
          {t('SelectionBar.moveto')}
        </ActionMenuItem>
      )
    }
  }
}

export const qualify = ({ pushModal, popModal }) => {
  return {
    icon: 'qualify',
    displayCondition: selection =>
      selection.length === 1 && isFile(selection[0]),
    action: files =>
      pushModal(
        <EditDocumentQualification
          document={files[0]}
          onQualified={() => {
            popModal()
            // changes should be retrieved through cozy-client
          }}
          onClose={popModal}
        />
      ),
    Component: function Qualify(props) {
      const { t } = useI18n()
      return (
        <ActionMenuItem
          onClick={() =>
            pushModal(
              <EditDocumentQualification
                document={props.files[0]}
                onQualified={() => {
                  popModal()
                  // changes should be retrieved through cozy-client
                }}
                onClose={popModal}
              />
            )
          }
          left={<Icon icon={QualifyIcon} />}
        >
          {t('SelectionBar.qualify')}
        </ActionMenuItem>
      )
    }
  }
}

export const versions = ({ router, location }) => {
  return {
    icon: 'history',
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
          onClick={() => {
            const tracker = getTracker()
            if (tracker) {
              tracker.push([
                'trackEvent',
                'Drive',
                'Versioning',
                'ClickFromMenuFile'
              ])
            }
            return router.push(
              `${location.pathname}/file/${props.files[0].id}/revision`
            )
          }}
          left={<Icon icon={HistoryIcon} />}
        >
          {t('SelectionBar.history')}
        </ActionMenuItem>
      )
    }
  }
}

export const offline = () => {
  return {
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
    icon: 'restore',
    action: async files => {
      await restoreFiles(client, files)
      refresh()
    },
    Component: function Restore(props) {
      const { t } = useI18n()
      return (
        <ActionMenuItem
          onClick={async () => {
            await restoreFiles(client, props.files)
            refresh()
          }}
          left={<Icon icon={RestoreIcon} />}
        >
          {t('SelectionBar.restore')}
        </ActionMenuItem>
      )
    }
  }
}

export const destroy = ({ pushModal, popModal }) => {
  return {
    icon: 'trash',
    label: 'destroy',
    action: files =>
      pushModal(<DestroyConfirm files={files} onClose={popModal} />),
    Component: function Destroy(props) {
      const { t } = useI18n()
      return (
        <ActionMenuItem
          onClick={() =>
            pushModal(<DestroyConfirm files={props.files} onClose={popModal} />)
          }
          left={<Icon icon={TrashIcon} color="var(--errorColor)" />}
        >
          <span className="u-error">{t('SelectionBar.destroy')}</span>
        </ActionMenuItem>
      )
    }
  }
}
