import React from 'react'
import { translate } from 'cozy-ui/transpiled/react/I18n'
import { ActionMenuItem } from 'cozy-ui/transpiled/react/ActionMenu'
import Icon from 'cozy-ui/transpiled/react/Icon'
import deleteContainer from './delete'

const DeleteItem = translate()(
  ({ t, isSharedWithMe, displayedFolder, trashFolder, onLeave }) =>
    isSharedWithMe ? (
      <ActionMenuItem
        data-test-id="fil-action-delete"
        left={<Icon icon="trash" color="var(--pomegranate)" />}
        onClick={() =>
          onLeave(displayedFolder).then(() => trashFolder(displayedFolder))
        }
      >
        <span className="u-pomegranate">{t('toolbar.leave')}</span>
      </ActionMenuItem>
    ) : (
      <ActionMenuItem
        data-test-id="fil-action-delete"
        left={<Icon icon="trash" color="var(--pomegranate)" />}
        onClick={() => trashFolder(displayedFolder)}
      >
        <span className="u-pomegranate">{t('toolbar.trash')}</span>
      </ActionMenuItem>
    )
)

export default deleteContainer(DeleteItem)
