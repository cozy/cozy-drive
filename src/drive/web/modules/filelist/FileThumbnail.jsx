import React from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'
import get from 'lodash/get'
import { SharedBadge, SharingOwnerAvatar } from 'cozy-sharing'
import InfosBadge from 'cozy-ui/transpiled/react/InfosBadge'
import GhostFileBadge from 'cozy-ui/transpiled/react/GhostFileBadge'
import Icon from 'cozy-ui/transpiled/react/Icon'
import useBreakpoints from 'cozy-ui/react/hooks/useBreakpoints'
import FileIcon from 'drive/web/modules/filelist/FileIcon'
import SharingShortcutBadge from 'drive/web/modules/filelist/SharingShortcutBadge'
import styles from 'drive/styles/filelist.styl'

const FileThumbnail = ({ file, size }) => {
  const { isMobile } = useBreakpoints()
  const isSharingShorcut = Boolean(get(file, 'metadata.sharing'))
  const isRegularShortcut = !isSharingShorcut && file.class === 'shortcut'
  const isSimpleFile = !isSharingShorcut && !isRegularShortcut

  return (
    <div
      className={cx(styles['fil-content-cell'], styles['fil-file-thumbnail'], {
        'u-pl-0': !isMobile
      })}
    >
      {isSimpleFile && <FileIcon file={file} size={size} />}
      {isRegularShortcut && (
        <InfosBadge badgeContent={<Icon icon="link" size={10} />}>
          <FileIcon file={file} size={size} />
        </InfosBadge>
      )}
      {isSharingShorcut && (
        <GhostFileBadge
          badgeContent={<SharingShortcutBadge file={file} size={16} />}
        >
          <SharingOwnerAvatar docId={file.id} size={'small'} />
        </GhostFileBadge>
      )}
      {/**
       * @todo
       * Since for shortcut we already display a kind of badge we're currently just
       * not displaying the sharedBadge. The next functionnal's task is to work on
       * sharing and we'll remove this badge from here. In the meantime, we take this
       * workaround
       */}
      {file.class !== 'shortcut' && (
        <SharedBadge
          docId={file.id}
          className={styles['fil-content-shared']}
          xsmall
        />
      )}
    </div>
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
