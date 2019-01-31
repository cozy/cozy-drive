import React from 'react'
import classNames from 'classnames'
import styles from 'drive/styles/toolbar'
import { translate } from 'cozy-ui/react/I18n'
import deleteContainer from './delete'
const DeleteItem = translate()(
  ({ t, isSharedWithMe, displayedFolder, trashFolder, onLeave }) =>
    isSharedWithMe ? (
      <a
        data-test-id="fil-action-delete"
        className={classNames(styles['fil-action-delete'])}
        onClick={() =>
          onLeave(displayedFolder).then(() => trashFolder(displayedFolder))
        }
      >
        {t('toolbar.leave')}
      </a>
    ) : (
      <a
        data-test-id="fil-action-delete"
        className={classNames(styles['fil-action-delete'])}
        onClick={() => trashFolder(displayedFolder)}
      >
        {t('toolbar.trash')}
      </a>
    )
)

export default deleteContainer(DeleteItem)
