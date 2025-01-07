import cx from 'classnames'
import React, { useState, useCallback, useRef } from 'react'

import ActionsMenu from 'cozy-ui/transpiled/react/ActionsMenu'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'

import { MoreButton } from '@/components/Button'

const PublicToolbarMoreMenu = ({ files, actions }) => {
  const moreButtonRef = useRef()
  const { isMobile } = useBreakpoints()

  const [menuIsVisible, setMenuVisible] = useState(false)

  const openMenu = useCallback(() => setMenuVisible(true), [setMenuVisible])
  const closeMenu = useCallback(() => setMenuVisible(false), [setMenuVisible])
  const toggleMenu = useCallback(() => {
    if (menuIsVisible) return closeMenu()
    openMenu()
  }, [closeMenu, openMenu, menuIsVisible])

  if (actions.length === 0) return null

  return (
    <>
      <div
        ref={moreButtonRef}
        data-testid="more-menu"
        className={cx({
          'u-ml-half': !isMobile
        })}
      >
        <MoreButton onClick={toggleMenu} />
      </div>
      {menuIsVisible && (
        <ActionsMenu
          open
          onClose={closeMenu}
          ref={moreButtonRef}
          docs={files}
          actions={actions}
        />
      )}
    </>
  )
}

export default PublicToolbarMoreMenu
