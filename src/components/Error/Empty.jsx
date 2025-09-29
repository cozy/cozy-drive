import cx from 'classnames'
import React from 'react'

import Empty from 'cozy-ui/transpiled/react/Empty'
import Icon from 'cozy-ui/transpiled/react/Icon'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import styles from './empty.styl'

import FolderEmptyIllu from '@/assets/icons/illu-folder-empty.svg'
import TrashIllustration from '@/assets/icons/illu-trash-empty.svg'
import { TRASH_DIR_ID } from '@/constants/config'
import { useDisplayedFolder } from '@/hooks'
import { isEncryptedFolder } from '@/lib/encryption'
import UploadButton from '@/modules/upload/UploadButton'

const EmptyCanvas = ({ type, canUpload, localeKey, hasTextMobileVersion }) => {
  const { t } = useI18n()
  const { isDesktop } = useBreakpoints()
  const { displayedFolder } = useDisplayedFolder()

  const IconToShow = type === 'trash' ? TrashIllustration : FolderEmptyIllu
  const showUploadLayout = type === 'drive' || type === 'encrypted'
  const title = localeKey ? t(`empty.${type}_title`) : undefined
  const text =
    (hasTextMobileVersion && !isDesktop && t(`empty.mobile_text`)) ||
    (localeKey && t(`empty.${localeKey}_text`)) ||
    (canUpload && t('empty.text'))

  return (
    <Empty
      className={cx({ [styles['empty']]: showUploadLayout })}
      data-testid="empty-folder"
      icon={
        <div className="u-w-100">
          <Icon icon={IconToShow} size={160} />
        </div>
      }
      iconSize={isDesktop ? 'medium' : 'large'}
      centered={!isDesktop}
      title={title}
      text={
        <>
          {text}
          {showUploadLayout && (
            <span className="u-db u-mt-1">
              <UploadButton
                componentsProps={{
                  button: { variant: 'secondary' }
                }}
                label={t('toolbar.menu_upload')}
                displayedFolder={displayedFolder}
              />
            </span>
          )}
        </>
      }
    />
  )
}

export default EmptyCanvas

export const EmptyDrive = props => {
  const { isEncrypted } = props
  if (isEncrypted) {
    return <EmptyCanvas type="encrypted" hasTextMobileVersion {...props} />
  }
  return <EmptyCanvas type="drive" hasTextMobileVersion {...props} />
}

export const EmptyTrash = props => (
  <EmptyCanvas type="trash" localeKey="trash" {...props} />
)

export const EmptyWrapper = ({
  currentFolderId,
  displayedFolder,
  canUpload
}) => {
  if (currentFolderId !== TRASH_DIR_ID) {
    return (
      <EmptyDrive
        isEncrypted={isEncryptedFolder(displayedFolder)}
        canUpload={canUpload}
      />
    )
  }

  return <EmptyTrash canUpload={canUpload} />
}
