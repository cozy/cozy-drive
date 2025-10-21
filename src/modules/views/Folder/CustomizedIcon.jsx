import React from 'react'

import foldersvg from 'cozy-ui/assets/icons/ui/folder.svg?raw'
import Icon from 'cozy-ui/transpiled/react/Icon'
import FolderIcon from 'cozy-ui/transpiled/react/Icons/Files'

import styles from '@/styles/folder-customizer.styl'

export const CustomizedIcon = ({ selectedColor = '#46a2ff', size }) => {
  const encoded = `url('data:image/svg+xml;utf8,${encodeURIComponent(
    foldersvg
  )}')`
  const maskStyle = {
    maskImage: encoded,
    WebkitMaskImage: encoded
  }

  return (
    <div
      className={styles.iconContainer}
      style={{
        ['--folder-color']: selectedColor,
        width: size,
        height: size
      }}
    >
      <Icon icon={FolderIcon} size={size || 32} />
      {maskStyle && <div className={styles.iconOverlay} style={maskStyle} />}
    </div>
  )
}

CustomizedIcon.displayName = 'CustomizedIcon'
