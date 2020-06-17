import React from 'react'
import classNames from 'classnames'
import ActionMenu from 'cozy-ui/transpiled/react/ActionMenu'
import Icon from 'cozy-ui/transpiled/react/Icon'
import { Caption } from 'cozy-ui/transpiled/react/Text'
import { translate } from 'cozy-ui/transpiled/react/I18n'
import { CozyFile } from 'models'
import { isDirectory } from 'drive/web/modules/drive/files'
import getMimeTypeIcon from 'drive/lib/getMimeTypeIcon'
import MenuItem from './MenuItem'

import styles from 'drive/styles/actionmenu.styl'

import { getBoundT } from 'cozy-scanner'
const Menu = props => {
  const { t, file, actions, onClose } = props
  const actionNames = Object.keys(actions).filter(actionName => {
    const action = actions[actionName]
    return (
      action.displayCondition === undefined || action.displayCondition([file])
    )
  })
  return (
    <ActionMenu className={styles['fil-mobileactionmenu']} onClose={onClose}>
      <MenuHeaderFile file={file} t={t} />
      <hr />
      {actionNames.map(actionName => {
        const Component = actions[actionName].Component || MenuItem
        const action = actions[actionName].action
        const onClick = action
          ? () => {
              const promise = action([file])
              onClose()
              return promise
            }
          : null
        return (
          <Component
            key={actionName}
            className={styles[`fil-action-${actionName}`]}
            onClick={onClick}
            files={[file]}
          >
            {t(`SelectionBar.${actionName}`)}
          </Component>
        )
      })}
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
          className="u-mr-1"
        />
        <div>
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

export default translate()(Menu)
