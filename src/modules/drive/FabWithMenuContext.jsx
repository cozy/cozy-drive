import React, { useContext } from 'react'

import { ExtendableFab } from 'cozy-ui/transpiled/react/Fab'
import PlusIcon from 'cozy-ui/transpiled/react/Icons/Plus'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import { AddMenuContext } from 'modules/drive/AddMenu/AddMenuProvider'
import { useFabStyles } from 'modules/drive/helpers'

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
    bottom: noSidebar ? '1rem' : 'calc(var(--sidebarHeight) + 2rem)'
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
