import React from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

import { models } from 'cozy-client'
import { SharedBadge, SharingOwnerAvatar } from 'cozy-sharing'
import InfosBadge from 'cozy-ui/transpiled/react/InfosBadge'
import GhostFileBadge from 'cozy-ui/transpiled/react/GhostFileBadge'
import Icon from 'cozy-ui/transpiled/react/Icon'
import useBreakpoints from 'cozy-ui/transpiled/react/hooks/useBreakpoints'
import Spinner from 'cozy-ui/transpiled/react/Spinner'
import { TableCell } from 'cozy-ui/transpiled/react/Table'
import LinkIcon from 'cozy-ui/transpiled/react/Icons/Link'

import FileIcon from 'drive/web/modules/filelist/FileIcon'
import SharingShortcutBadge from 'drive/web/modules/filelist/SharingShortcutBadge'

import styles from 'drive/styles/filelist.styl'

const FileThumbnail = ({ file, size, isInSyncFromSharing }) => {
  const { isMobile } = useBreakpoints()
  const isSharingShortcut =
    models.file.isSharingShortcut(file) && !isInSyncFromSharing
  const isRegularShortcut =
    !isSharingShortcut && file.class === 'shortcut' && !isInSyncFromSharing
  const isSimpleFile =
    !isSharingShortcut && !isRegularShortcut && !isInSyncFromSharing

  return (
    <TableCell
      className={cx(styles['fil-content-cell'], styles['fil-file-thumbnail'], {
        'u-pl-0': !isMobile
      })}
    >
      {isSimpleFile && <FileIcon file={file} size={size} />}
      {isRegularShortcut && (
        <InfosBadge badgeContent={<Icon icon={LinkIcon} size={10} />}>
          <FileIcon file={file} size={size} />
        </InfosBadge>
      )}
      {isSharingShortcut && (
        <GhostFileBadge
          badgeContent={<SharingShortcutBadge file={file} size={16} />}
        >
          <SharingOwnerAvatar docId={file.id} size={'small'} />
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
      {file.class !== 'shortcut' &&
        isMobile &&
        !isInSyncFromSharing && (
          <SharedBadge
            docId={file.id}
            className={styles['fil-content-shared']}
            xsmall
          />
        )}
    </TableCell>
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
