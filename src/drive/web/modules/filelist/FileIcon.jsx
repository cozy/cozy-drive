import React from 'react'
import FileIconMime from 'drive/web/modules/filelist/FileIconMime'
import FileIconShortcut from 'drive/web/modules/filelist/FileIconShortcut'
import { ImageLoader } from 'components/Image'
import styles from 'drive/styles/filelist.styl'

const FileIcon = ({ file, size }) => {
  const isImage = file.class === 'image'
  const isShortcut = file.class === 'shortcut'

  if (isImage)
    return (
      <ImageLoader
        file={file}
        size="small"
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
  else return <FileIconMime file={file} size={size} />
}

export default FileIcon
