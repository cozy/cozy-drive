import React, { useState, useCallback, useRef } from 'react'

import ActionsMenu from 'cozy-ui/transpiled/react/ActionsMenu'

import MoreButton from 'components/Button/MoreButton'

/**
 * Renders a MoreMenu component.
 *
 * @param actions - The actions to be displayed in the menu.
 * @param docs - The documents to which the actions apply.
 * @param disabled - Indicates whether the menu is disabled.
 * @returns The rendered MoreMenu component.
 */
const MoreMenu = ({ actions, docs, disabled }) => {
  const [isMenuOpened, setMenuOpened] = useState(false)
  const moreButtonRef = useRef(null)
  const openMenu = useCallback(() => setMenuOpened(true), [setMenuOpened])
  const closeMenu = useCallback(() => setMenuOpened(false), [setMenuOpened])

  return (
    <>
      <div ref={moreButtonRef}>
        <MoreButton onClick={openMenu} disabled={disabled} />
      </div>
      {isMenuOpened ? (
        <ActionsMenu
          open
          ref={moreButtonRef}
          onClose={closeMenu}
          actions={actions}
          docs={docs}
          anchorOrigin={{
            strategy: 'fixed',
            vertical: 'bottom',
            horizontal: 'right'
          }}
        />
      ) : null}
    </>
  )
}

export { MoreMenu }
