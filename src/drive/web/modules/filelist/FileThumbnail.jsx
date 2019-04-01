import React from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'
import { Icon, withBreakpoints } from 'cozy-ui/react'
import { ImageLoader } from 'components/Image'
import { SharedBadge } from 'sharing'

import styles from 'drive/styles/filelist.styl'

import { getFileMimetype } from 'drive/lib/getFileMimetype'
import { isDirectory } from 'drive/web/modules/drive/files'
import IconFolder from 'drive/assets/icons/icon-type-folder.svg'
import IconAudio from 'drive/assets/icons/icon-type-audio.svg'
import IconBin from 'drive/assets/icons/icon-type-bin.svg'
import IconCode from 'drive/assets/icons/icon-type-code.svg'
import IconFiles from 'drive/assets/icons/icon-type-files.svg'
import IconImage from 'drive/assets/icons/icon-type-image.svg'
import IconPdf from 'drive/assets/icons/icon-type-pdf.svg'
import IconSlide from 'drive/assets/icons/icon-type-slide.svg'
import IconSheet from 'drive/assets/icons/icon-type-sheet.svg'
import IconText from 'drive/assets/icons/icon-type-text.svg'
import IconVideo from 'drive/assets/icons/icon-type-video.svg'
import IconZip from 'drive/assets/icons/icon-type-zip.svg'
import IconNote from 'drive/assets/icons/icon-type-note.svg'

const getFileIcon = file => {
  if (isDirectory(file)) {
    return IconFolder
  } else if (/\.cozynote$/.test(file.name)) {
    return IconNote
  } else {
    const iconsByMimeType = {
      audio: IconAudio,
      bin: IconBin,
      code: IconCode,
      image: IconImage,
      pdf: IconPdf,
      slide: IconSlide,
      sheet: IconSheet,
      text: IconText,
      video: IconVideo,
      zip: IconZip
    }
    const type = getFileMimetype(iconsByMimeType)(file.mime, file.name)
    return type ? iconsByMimeType[type] : IconFiles
  }
}

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
        <Icon icon={getFileIcon(attributes)} size={32} />
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
