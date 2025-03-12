import cx from 'classnames'
import React from 'react'

import Empty from 'cozy-ui/transpiled/react/Empty'
import Icon from 'cozy-ui/transpiled/react/Icon'
import DriveIcon from 'cozy-ui/transpiled/react/Icons/FileTypeFolder'
import PhotosIcon from 'cozy-ui/transpiled/react/Icons/FileTypeImage'
import TrashIcon from 'cozy-ui/transpiled/react/Icons/Trash'
import { isTwakeTheme } from 'cozy-ui/transpiled/react/helpers/isTwakeTheme'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import styles from './empty.styl'

import FolderEmptyIllu from '@/assets/icons/illu-folder-empty.svg'
import EncryptedFolderIcon from '@/modules/views/Folder/EncryptedFolderIcon'

const EmptyIcon = {
  drive: DriveIcon,
  encrypted: EncryptedFolderIcon,
  photos: PhotosIcon,
  trash: TrashIcon
}

const EmptyCanvas = ({ type, canUpload, localeKey, hasTextMobileVersion }) => {
  const { t } = useI18n()
  const { isMobile } = useBreakpoints()
  const props = isTwakeTheme()
    ? {
        icon: (
          <div className="u-w-100">
            <Icon icon={FolderEmptyIllu} size={160} />
          </div>
        ),
        iconSize: isMobile ? 'large' : 'medium'
      }
    : {}

  return (
    <Empty
      data-testid="empty-folder"
      icon={EmptyIcon[type]}
      title={localeKey ? t(`empty.${localeKey}_title`) : t('empty.title')}
      text={
        (hasTextMobileVersion &&
          isMobile &&
          t(`empty.${localeKey}_mobile_text`)) ||
        (localeKey && t(`empty.${localeKey}_text`)) ||
        (canUpload && t('empty.text'))
      }
      className={cx(styles['empty'])}
      {...props}
    />
  )
}

export default EmptyCanvas

export const EmptyDrive = props => {
  const { isEncrypted } = props
  if (isEncrypted) {
    return <EmptyCanvas type="encrypted" {...props} />
  }
  return <EmptyCanvas type="drive" {...props} />
}
export const EmptyPhotos = props => <EmptyCanvas type="photos" {...props} />

export const EmptyTrash = props => (
  <EmptyCanvas type="trash" localeKey="trash" {...props} />
)
