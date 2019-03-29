import React from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'
import { withBreakpoints } from 'cozy-ui/react'
import { ImageLoader } from 'components/Image'
import { SharedBadge } from 'sharing'
import FileIcon from './FileIcon'
import styles from 'drive/styles/filelist.styl'

const FileThumbnail = ({
  file,
  withSharedBadge,
  breakpoints: { isMobile }
}) => {
  const isImage = file.class === 'image'
  return (
    <div
      className={cx(styles['fil-content-cell'], styles['fil-file-thumbnail'], {
        'u-pl-0': !isMobile
      })}
    >
      {isImage ? (
        <ImageLoader
          file={file}
          size="small"
          render={src => (
            <img
              src={src}
              width={32}
              height={32}
              className={styles['fil-file-thumbnail-image']}
            />
          )}
          renderFallback={() => <FileIcon file={file} />}
        />
      ) : (
        <FileIcon file={file} />
      )}
      {withSharedBadge && (
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
  withSharedBadge: PropTypes.bool,
  breakpoints: PropTypes.shape({
    isMobile: PropTypes.bool
  }).isRequired
}

export default withBreakpoints()(FileThumbnail)
