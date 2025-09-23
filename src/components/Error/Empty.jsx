import cx from 'classnames'
import React from 'react'

import Empty from 'cozy-ui/transpiled/react/Empty'
import Icon from 'cozy-ui/transpiled/react/Icon'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import styles from './empty.styl'

import FolderEmptyIllu from '@/assets/icons/illu-folder-empty.svg'
import TrashIllustration from '@/assets/icons/illu-trash-empty.svg'

const EmptyCanvas = ({ type, canUpload, localeKey, hasTextMobileVersion }) => {
  const { t } = useI18n()
  const { isMobile } = useBreakpoints()

  const otherProps = { iconSize: isMobile ? 'large' : 'medium' }
  const IconToShow = type === 'trash' ? TrashIllustration : FolderEmptyIllu

  return (
    <Empty
      data-testid="empty-folder"
      icon={
        <div className="u-w-100">
          <Icon icon={IconToShow} size={160} />
        </div>
      }
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
