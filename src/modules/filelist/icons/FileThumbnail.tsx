import React from 'react'

import { models } from 'cozy-client'
import { SharedBadge, SharingOwnerAvatar } from 'cozy-sharing'
import GhostFileBadge from 'cozy-ui/transpiled/react/GhostFileBadge'
import Icon from 'cozy-ui/transpiled/react/Icon'
import LinkIcon from 'cozy-ui/transpiled/react/Icons/Link'
import TrashDuotoneIcon from 'cozy-ui/transpiled/react/Icons/TrashDuotone'
import InfosBadge from 'cozy-ui/transpiled/react/InfosBadge'
import Spinner from 'cozy-ui/transpiled/react/Spinner'

import IconServer from 'assets/icons/icon-type-server.svg'
import type { File, FolderPickerEntry } from 'components/FolderPicker/types'
import FileIcon from 'modules/filelist/icons/FileIcon'
import FileIconMime from 'modules/filelist/icons/FileIconMime'
import { SharingShortcutIcon } from 'modules/filelist/icons/SharingShortcutIcon'
import { isNextcloudShortcut, isNextcloudFile } from 'modules/nextcloud/helpers'

import styles from 'styles/filelist.styl'

interface FileThumbnailProps {
  file: File | FolderPickerEntry
  size?: number
  isInSyncFromSharing?: boolean
  isEncrypted?: boolean
  showSharedBadge?: boolean
  componentsProps?: {
    sharedBadge?: object
  }
}

const FileThumbnail: React.FC<FileThumbnailProps> = ({
  file,
  size,
  isInSyncFromSharing,
  isEncrypted,
  showSharedBadge = false,
  componentsProps = {
    sharedBadge: {}
  }
}) => {
  if (isNextcloudFile(file)) {
    return <FileIconMime file={file} size={size} />
  }

  if (file._id?.endsWith('.trash-dir')) {
    return <Icon icon={TrashDuotoneIcon} size={size ?? 32} />
  }

  if (
    file._id === 'io.cozy.files.shared-drives-dir' ||
    isNextcloudShortcut(file)
  ) {
    return <Icon icon={IconServer} size={size ?? 32} />
  }

  const isSharingShortcut =
    models.file.isSharingShortcut(file) && !isInSyncFromSharing
  const isRegularShortcut =
    !isSharingShortcut && file.class === 'shortcut' && !isInSyncFromSharing
  const isSimpleFile =
    !isSharingShortcut && !isRegularShortcut && !isInSyncFromSharing

  return (
    <>
      {isSimpleFile && (
        <FileIcon file={file} size={size} isEncrypted={isEncrypted} />
      )}
      {isRegularShortcut && (
        <InfosBadge badgeContent={<Icon icon={LinkIcon} size={10} />}>
          <FileIcon file={file} size={size} isEncrypted={isEncrypted} />
        </InfosBadge>
      )}
      {isSharingShortcut && (
        <GhostFileBadge
          badgeContent={<SharingShortcutIcon file={file} size={16} />}
        >
          <SharingOwnerAvatar docId={file._id} size="small" />
        </GhostFileBadge>
      )}
      {isInSyncFromSharing && (
        <span data-testid="fil-file-thumbnail--spinner">
          <Spinner
            size="large"
            className={styles['fil-file-thumbnail--spinner']}
          />
        </span>
      )}
      {/**
       * @todo
       * Since for shortcut we already display a kind of badge we're currently just
       * not displaying the sharedBadge. Besides on desktop we have added sharing avatars.
       * The next functionnal's task is to work on sharing and we'll remove
       * this badge from here. In the meantime, we take this workaround
       */}
      {file.class !== 'shortcut' && showSharedBadge && !isInSyncFromSharing && (
        <SharedBadge docId={file._id} {...componentsProps.sharedBadge} xsmall />
      )}
    </>
  )
}

export default FileThumbnail
