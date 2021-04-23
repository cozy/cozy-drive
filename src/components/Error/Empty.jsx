import React from 'react'

import { translate } from 'cozy-ui/transpiled/react/I18n'
import Empty from 'cozy-ui/transpiled/react/Empty'
import DriveIcon from 'cozy-ui/transpiled/react/Icons/FileTypeFolder'
import TrashIcon from 'cozy-ui/transpiled/react/Icons/Trash'
import PhotosIcon from 'cozy-ui/transpiled/react/Icons/FileTypeImage'

const EmptyIcon = {
  drive: DriveIcon,
  photos: PhotosIcon,
  trash: TrashIcon
}

const EmptyCanvas = translate()(({ t, type, canUpload, localeKey }) => {
  return (
    <Empty
      data-test-id="empty-folder"
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
