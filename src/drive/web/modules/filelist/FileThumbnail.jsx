import React from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'
import { Icon, withBreakpoints } from 'cozy-ui/react'
import { ImageLoader } from 'components/Image'
import { SharedBadge } from 'sharing'

import getMimeTypeIcon from 'drive/lib/getMimeTypeIcon'
import { isDirectory } from 'drive/web/modules/drive/files'
import styles from 'drive/styles/filelist.styl'

const FileThumbnail = ({
  attributes,
  withSharedBadge,
  breakpoints: { isMobile }
}) => {
  const isImage = attributes.class === 'image'
  return (
    <div
      className={cx(styles['fil-content-cell'], styles['fil-file-thumbnail'], {
        'u-pl-0': !isMobile
      })}
    >
      {isImage ? (
        <ImageLoader
          file={attributes}
          size="small"
          render={src => (
            <img
              src={src}
              width={32}
              height={32}
              className={styles['fil-file-thumbnail-image']}
            />
          )}
        />
      ) : (
        <Icon
          icon={getMimeTypeIcon(
            isDirectory(attributes),
            attributes.name,
            attributes.mime
          )}
          size={32}
        />
      )}
      {withSharedBadge && (
        <SharedBadge
          docId={attributes.id}
          className={styles['fil-content-shared']}
          xsmall
        />
      )}
    </div>
  )
}

FileThumbnail.propTypes = {
  attributes: PropTypes.shape({
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
