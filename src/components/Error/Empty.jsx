import React from 'react'
import { translate } from 'cozy-ui/react/I18n'
import { Empty } from 'cozy-ui/react'

import DriveIcon from 'drive/assets/icons/icon-type-folder.svg'
import PhotosIcon from 'photos/assets/icons/icon-main-app.svg'
import TrashIcon from 'drive/assets/icons/icon-trash-big.svg'

const EmptyIcon = {
  drive: DriveIcon,
  photos: PhotosIcon,
  trash: TrashIcon
}

const EmptyCanvas = translate()(({ t, type, canUpload, localeKey }) => {
  return (
    <Empty
      icon={EmptyIcon[type]}
      title={localeKey ? t(`empty.${localeKey}_title`) : t('empty.title')}
      text={
        (localeKey && t(`empty.${localeKey}_text`)) ||
        (canUpload && t('empty.text'))
      }
    />
  )
})

export default EmptyCanvas

export const EmptyDrive = props => <EmptyCanvas type="drive" {...props} />

export const EmptyPhotos = props => <EmptyCanvas type="photos" {...props} />

export const EmptyTrash = props => (
  <EmptyCanvas type="trash" localeKey="trash" {...props} />
)
