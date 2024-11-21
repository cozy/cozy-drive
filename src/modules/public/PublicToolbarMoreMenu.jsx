import cx from 'classnames'
import React, { useState, useCallback, useRef } from 'react'

import ActionsMenu from 'cozy-ui/transpiled/react/ActionsMenu'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'

import { MoreButton } from 'components/Button'

const PublicToolbarMoreMenu = ({ files, actions, children }) => {
  const moreButtonRef = useRef()
  const { isMobile } = useBreakpoints()

  const [menuIsVisible, setMenuVisible] = useState(false)

  const openMenu = useCallback(() => setMenuVisible(true), [setMenuVisible])
  const closeMenu = useCallback(() => setMenuVisible(false), [setMenuVisible])
  const toggleMenu = useCallback(() => {
    if (menuIsVisible) return closeMenu()
    openMenu()
  }, [closeMenu, openMenu, menuIsVisible])

  return (
    <>
      <div
        ref={moreButtonRef}
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
        >
          {React.Children.map(children, child => {
            if (React.isValidElement(child)) {
              return React.cloneElement(child, {
                onClick: () => {
                  child.props.onClick?.()
                  closeMenu()
                }
              })
            }
          })}
        </ActionsMenu>
      )}
    </>
  )
}

export default PublicToolbarMoreMenu
