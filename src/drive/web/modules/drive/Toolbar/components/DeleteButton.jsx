import React from 'react'
import { Item } from 'components/Menu'
import classNames from 'classnames'
import styles from 'drive/styles/toolbar'
import { translate } from 'cozy-ui/react/I18n'
import deleteContainer from 'drive/web/modules/drive/Toolbar/containers/delete'
const DeleteButton = translate()(
  ({ t, isSharedWithMe, displayedFolder, trashFolder, onLeave }) =>
    isSharedWithMe ? (
      <Item>
        <a
          className={classNames(styles['fil-action-delete'])}
          onClick={() =>
            onLeave(displayedFolder).then(() => trashFolder(displayedFolder))
          }
        >
          {t('toolbar.leave')}
        </a>
      </Item>
    ) : (
      <Item>
        <a
          className={classNames(styles['fil-action-delete'])}
          onClick={() => trashFolder(displayedFolder)}
        >
          {t('toolbar.trash')}
        </a>
      </Item>
    )
)

export default deleteContainer(DeleteButton)
