import React, { useContext } from 'react'

import PlusIcon from 'cozy-ui/transpiled/react/Icons/Plus'

import Fab from 'drive/web/modules/drive/Fab'
import { AddMenuContext } from 'drive/web/modules/drive/AddMenu/AddMenuProvider'

const FabWithMenuContext = ({ noSidebar }) => {
  const { anchorRef, handleToggle, isDisabled, handleOfflineClick, isOffline } =
    useContext(AddMenuContext)

  return (
    <div
      ref={anchorRef ? anchorRef : undefined}
      onClick={isOffline ? handleOfflineClick : undefined}
    >
      <Fab
        noSidebar={noSidebar}
        aria-label="add"
        disabled={isDisabled || isOffline}
        icon={PlusIcon}
        color="primary"
        onClick={handleToggle}
      />
    </div>
  )
}

export default React.memo(FabWithMenuContext)
