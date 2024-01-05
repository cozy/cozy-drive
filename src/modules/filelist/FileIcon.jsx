import React from 'react'
import flag from 'cozy-flags'
import FileIconMime from 'modules/filelist/FileIconMime'
import FileIconShortcut from 'modules/filelist/FileIconShortcut'
import FileImageLoader from 'cozy-ui/transpiled/react/FileImageLoader'
import styles from 'styles/filelist.styl'

const FileIcon = ({ file, size, isEncrypted }) => {
  const isImage = file.class === 'image'
  const isShortcut = file.class === 'shortcut'
  const shoudUseThumbnailsForPDF = flag('drive.thumbnails-pdf.enabled')
  if (isImage || (shoudUseThumbnailsForPDF && file.class === 'pdf'))
    return (
      <FileImageLoader
        file={file}
        linkType="tiny"
        render={src => (
          <img
            src={src}
            width={size || 32}
            height={size || 32}
            className={styles['fil-file-thumbnail-image']}
          />
        )}
        renderFallback={() => <FileIconMime file={file} size={size} />}
      />
    )
  else if (isShortcut) return <FileIconShortcut file={file} size={size} />
  else return <FileIconMime file={file} size={size} isEncrypted={isEncrypted} />
}

export default FileIcon
