import React from 'react'
import classNames from 'classnames'
import ActionMenu, {
  ActionMenuHeader
} from 'cozy-ui/transpiled/react/ActionMenu'

import Icon from 'cozy-ui/transpiled/react/Icon'
import { Caption } from 'cozy-ui/transpiled/react/Text'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import { CozyFile } from 'models'
import { isDirectory } from 'drive/web/modules/drive/files'
import getMimeTypeIcon from 'drive/lib/getMimeTypeIcon'
import { ActionsItems } from './ActionsItems'
import styles from 'drive/styles/actionmenu.styl'

import { getBoundT } from 'cozy-scanner'

export const ActionMenuWithHeader = ({
  file,
  actions,
  onClose,
  anchorElRef
}) => {
  const { lang } = useI18n()
  return (
    <ActionMenu
      onClose={onClose}
      anchorElRef={anchorElRef}
      autoclose={true}
      popperOptions={{
        strategy: 'fixed'
      }}
    >
      <ActionMenuHeader>
        <MenuHeaderFile file={file} lang={lang} />
      </ActionMenuHeader>
      <ActionsItems actions={actions} file={file} onClose={onClose} />
    </ActionMenu>
  )
}

const MenuHeaderFile = ({ file, lang }) => {
  const { filename, extension } = CozyFile.splitFilename(file)

  const scannerT = getBoundT(lang)
  return (
    <div>
      <div className={'u-p-1 u-flex u-flex-items-center'}>
        <Icon
          icon={getMimeTypeIcon(isDirectory(file), file.name, file.mime)}
          size={32}
          className="u-flex-shrink-0 u-mr-1"
        />
        <div className="u-w-100">
          <div className={classNames(styles['fil-mobileactionmenu-header'])}>
            <span className={styles['fil-mobileactionmenu-file-name']}>
              {filename}
            </span>
            <span className={styles['fil-mobileactionmenu-file-ext']}>
              {extension}
            </span>
          </div>
          {file.metadata &&
            file.metadata.label && (
              <div className="u-coolGrey u-fz-tiny u-fs-normal u-flex u-flex-items-center">
                <Icon icon="qualify" size="10" />
                <Caption
                  className={classNames(
                    styles['fil-mobileactionmenu-category']
                  )}
                >
                  {scannerT(`Scan.items.${file.metadata.label}`)}
                </Caption>
              </div>
            )}
        </div>
      </div>
    </div>
  )
}
