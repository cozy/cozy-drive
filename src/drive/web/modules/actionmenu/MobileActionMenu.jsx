import React from 'react'
import classNames from 'classnames'
import { ActionMenu, Icon } from 'cozy-ui/react'
import { translate } from 'cozy-ui/react/I18n'
import { splitFilename } from 'drive/web/modules/filelist/File'
import { isDirectory } from 'drive/web/modules/drive/files'
import getMimeTypeIcon from 'drive/lib/getMimeTypeIcon'
import MenuItem from './MenuItem'

import styles from 'drive/styles/actionmenu.styl'

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
      <MenuHeaderFile file={file} />
      <hr />
      {actionNames.map(actionName => {
        const Component = actions[actionName].Component || MenuItem
        const action = actions[actionName].action
        const onClick = !action
          ? undefined
          : () => {
              const promise = action([file])
              onClose()
              return promise
            }
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

const MenuHeaderFile = ({ file }) => {
  const { filename, extension } = splitFilename(file)
  return (
    <div>
      <div
        className={classNames(
          styles['fil-mobileactionmenu-header'],
          'u-p-1',
          'u-flex',
          'u-flex-items-center'
        )}
      >
        <Icon
          icon={getMimeTypeIcon(isDirectory(file), file.name, file.mime)}
          size={32}
          className="u-mr-1"
        />
        <span className={styles['fil-mobileactionmenu-file-name']}>
          {filename}
        </span>
        <span className={styles['fil-mobileactionmenu-file-ext']}>
          {extension}
        </span>
      </div>
    </div>
  )
}

export default translate()(Menu)
