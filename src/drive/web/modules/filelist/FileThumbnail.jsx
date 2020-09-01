import React from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'
import withBreakpoints from 'cozy-ui/transpiled/react/helpers/withBreakpoints'
import { SharedBadge } from 'cozy-sharing'
import FileIcon from 'drive/web/modules/filelist/FileIcon'
import styles from 'drive/styles/filelist.styl'
import Badge from 'cozy-ui/transpiled/react/Badge'
import Icon from 'cozy-ui/transpiled/react/Icon'
import get from 'lodash/get'

const FileThumbnail = ({ file, breakpoints: { isMobile }, size }) => {
  const isRegularShortcut = file.class === 'shortcut'
  const isSimpleFile = !isRegularShortcut
  return (
    <div
      className={cx(styles['fil-content-cell'], styles['fil-file-thumbnail'], {
        'u-pl-0': !isMobile
      })}
    >
      {isSimpleFile && <FileIcon file={file} size={size} />}
      {isRegularShortcut && (
        <Badge
          badgeContent={<Icon icon="link" size={10} />}
          anchorOrigin={{ vertical: 'bottom' }}
          variant={'qualifier'}
        >
          <FileIcon file={file} size={size} />
        </Badge>
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
  breakpoints: PropTypes.shape({
    isMobile: PropTypes.bool
  }).isRequired,
  size: PropTypes.number
}

export default withBreakpoints()(FileThumbnail)
