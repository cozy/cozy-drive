import PropTypes from 'prop-types'
import React from 'react'

import { models } from 'cozy-client'
import { SharedBadge, SharingOwnerAvatar } from 'cozy-sharing'
import GhostFileBadge from 'cozy-ui/transpiled/react/GhostFileBadge'
import Icon from 'cozy-ui/transpiled/react/Icon'
import LinkIcon from 'cozy-ui/transpiled/react/Icons/Link'
import Openwith from 'cozy-ui/transpiled/react/Icons/Openwith'
import InfosBadge from 'cozy-ui/transpiled/react/InfosBadge'
import Spinner from 'cozy-ui/transpiled/react/Spinner'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'

import FileIcon from 'modules/filelist/FileIcon'
import { SharingShortcutIcon } from 'modules/filelist/SharingShortcutIcon'

import styles from 'styles/filelist.styl'

const FileThumbnail = ({
  file,
  size,
  isInSyncFromSharing,
  isEncrypted,
  isExternal
}) => {
  const { isMobile } = useBreakpoints()
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
      {!isExternal && isRegularShortcut && (
        <InfosBadge badgeContent={<Icon icon={LinkIcon} size={10} />}>
          <FileIcon file={file} size={size} />
        </InfosBadge>
      )}
      {isExternal && (
        <InfosBadge badgeContent={<Icon icon={Openwith} size={10} />}>
          <FileIcon file={file} size={size} />
        </InfosBadge>
      )}
      {isSharingShortcut && (
        <GhostFileBadge
          badgeContent={<SharingShortcutIcon file={file} size={16} />}
        >
          <SharingOwnerAvatar docId={file.id} size="small" />
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
      {file.class !== 'shortcut' && isMobile && !isInSyncFromSharing && (
        <SharedBadge
          docId={file.id}
          className={styles['fil-content-shared']}
          xsmall
        />
      )}
    </>
  )
}

FileThumbnail.propTypes = {
  file: PropTypes.shape({
    class: PropTypes.string,
    mime: PropTypes.string,
    name: PropTypes.string
  }).isRequired,
  size: PropTypes.number
}

export default FileThumbnail
