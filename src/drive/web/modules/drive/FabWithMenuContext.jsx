import React, { useContext } from 'react'

import PlusIcon from 'cozy-ui/transpiled/react/Icons/Plus'

import Fab from 'drive/web/modules/drive/Fab'
import { AddMenuContext } from 'drive/web/modules/drive/AddMenu/AddMenuProvider'
import Icon from 'cozy-ui/transpiled/react/Icon'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'

const FabWithMenuContext = ({ noSidebar }) => {
  const { t } = useI18n()

  const { anchorRef, handleToggle, isDisabled, handleOfflineClick, isOffline } =
    useContext(AddMenuContext)

  return (
    <div
      ref={anchorRef ? anchorRef : undefined}
      onClick={isOffline ? handleOfflineClick : undefined}
    >
      <Fab
        bottom={noSidebar ? '1rem' : 'calc(var(--sidebarHeight) + 1rem)'}
        aria-label={t('button.add')}
        disabled={isDisabled || isOffline}
        color="primary"
        onClick={handleToggle}
      >
        <Icon icon={PlusIcon} />
      </Fab>
    </div>
  )
}

export default React.memo(FabWithMenuContext)
