import cx from 'classnames'
import React from 'react'

import Empty from 'cozy-ui/transpiled/react/Empty'
import Icon from 'cozy-ui/transpiled/react/Icon'
import DriveIcon from 'cozy-ui/transpiled/react/Icons/FileTypeFolder'
import PhotosIcon from 'cozy-ui/transpiled/react/Icons/FileTypeImage'
import { isTwakeTheme } from 'cozy-ui/transpiled/react/helpers/isTwakeTheme'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import styles from './empty.styl'

import FolderEmptyIllu from '@/assets/icons/illu-folder-empty.svg'
import TrashIllustration from '@/assets/icons/illustration-empty-trash.svg'
import EncryptedFolderIcon from '@/modules/views/Folder/EncryptedFolderIcon'

const EmptyIcon = {
  drive: DriveIcon,
  encrypted: EncryptedFolderIcon,
  photos: PhotosIcon,
  trash: TrashIllustration
}

const EmptyCanvas = ({ type, canUpload, localeKey, hasTextMobileVersion }) => {
  const { t } = useI18n()
  const { isMobile } = useBreakpoints()

  let iconToShow = EmptyIcon[type]
  if (isTwakeTheme() && type !== 'trash') {
    iconToShow = (
      <div className="u-w-100">
        <Icon icon={FolderEmptyIllu} size={160} />
      </div>
    )
  }

  const otherProps = isTwakeTheme()
    ? { iconSize: isMobile ? 'large' : 'medium' }
    : {}

  return (
    <Empty
      data-testid="empty-folder"
      icon={iconToShow}
      title={localeKey ? t(`empty.${localeKey}_title`) : t('empty.title')}
      text={
        (hasTextMobileVersion &&
          isMobile &&
          t(`empty.${localeKey}_mobile_text`)) ||
        (localeKey && t(`empty.${localeKey}_text`)) ||
        (canUpload && t('empty.text'))
      }
      className={cx(styles['empty'])}
      {...otherProps}
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
