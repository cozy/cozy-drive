import React from 'react'

import foldersvg from 'cozy-ui/assets/icons/ui/folder.svg?raw'
import Icon from 'cozy-ui/transpiled/react/Icon'
import IconStack from 'cozy-ui/transpiled/react/IconStack'
import FolderIcon from 'cozy-ui/transpiled/react/Icons/Files'

import styles from '@/styles/folder-customizer.styl'

import { getIcon } from '@/components/IconPicker/IconIndex'

export const CustomizedIcon = ({
  selectedColor = '#46a2ff',
  selectedIcon,
  size
}) => {
  const encoded = `url('data:image/svg+xml;utf8,${encodeURIComponent(
    foldersvg
  )}')`
  const maskStyle = {
    maskImage: encoded,
    WebkitMaskImage: encoded
  }

  return (
    <div>
      <IconStack
        offset={{ vertical: `${size / 20}px` }}
        backgroundIcon={
          <div
            className={`${styles.iconContainer} u-pos-relative u-dib`}
            style={{
              ['--folder-color']: selectedColor,
              width: size,
              height: size
            }}
          >
            <Icon icon={FolderIcon} size={size || 32} />
            {maskStyle && (
              <div
                className={`${styles.iconOverlay} u-pos-absolute u-top-0 u-left-0 u-w-100 u-h-100`}
                style={maskStyle}
              />
            )}
          </div>
        }
        foregroundIcon={
          <Icon
            icon={getIcon(selectedIcon)}
            color="#555556"
            size={size / 3 || 16}
          />
        }
      />
    </div>
  )
}
