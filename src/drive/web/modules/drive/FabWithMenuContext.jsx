import React, { useContext } from 'react'

import PlusIcon from 'cozy-ui/transpiled/react/Icons/Plus'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import { ExtendableFab } from 'cozy-ui/transpiled/react/Fab'

import { AddMenuContext } from 'drive/web/modules/drive/AddMenu/AddMenuProvider'
import { useFabStyles } from 'drive/web/modules/drive/helpers'

const FabWithMenuContext = ({ noSidebar }) => {
  const { t } = useI18n()

  const {
    anchorRef,
    handleToggle,
    isDisabled,
    handleOfflineClick,
    isOffline,
    a11y
  } = useContext(AddMenuContext)

  const styles = useFabStyles({
    bottom: noSidebar ? '1rem' : 'calc(var(--sidebarHeight) + 1rem)'
  })

  return (
    <div
      ref={anchorRef ? anchorRef : undefined}
      onClick={isOffline ? handleOfflineClick : undefined}
    >
      <ExtendableFab
        color="primary"
        label={t('button.add')}
        icon={PlusIcon}
        className={styles.root}
        disabled={isDisabled || isOffline}
        follow={window}
        onClick={handleToggle}
        {...a11y}
      />
    </div>
  )
}

export default React.memo(FabWithMenuContext)
