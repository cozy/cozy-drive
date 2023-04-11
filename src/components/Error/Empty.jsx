import React from 'react'
import cx from 'classnames'

import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import Empty from 'cozy-ui/transpiled/react/Empty'
import DriveIcon from 'cozy-ui/transpiled/react/Icons/FileTypeFolder'
import TrashIcon from 'cozy-ui/transpiled/react/Icons/Trash'
import PhotosIcon from 'cozy-ui/transpiled/react/Icons/FileTypeImage'
import EncryptedFolderIcon from 'drive/web/modules/views/Folder/EncryptedFolderIcon'

import styles from './empty.styl'

const EmptyIcon = {
  drive: DriveIcon,
  encrypted: EncryptedFolderIcon,
  photos: PhotosIcon,
  trash: TrashIcon
}

const EmptyCanvas = ({ type, canUpload, localeKey }) => {
  const { t } = useI18n()
  return (
    <Empty
      data-testid="empty-folder"
      icon={EmptyIcon[type]}
      title={localeKey ? t(`empty.${localeKey}_title`) : t('empty.title')}
      text={
        (localeKey && t(`empty.${localeKey}_text`)) ||
        (canUpload && t('empty.text'))
      }
      className={cx(styles['empty'], 'u-mh-2')}
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
