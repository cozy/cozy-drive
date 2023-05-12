import React, { useRef, useState } from 'react'
import PropTypes from 'prop-types'

import ActionMenu from 'cozy-ui/transpiled/react/ActionsMenu'
import { makeActions } from 'cozy-ui/transpiled/react/ActionsMenu/Actions'

import { MoreButton } from 'components/Button'

const MoreMenu = ({ actions }) => {
  const anchorRef = useRef(null)
  const [isMenuOpen, setMenuOpen] = useState(false)

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen)
  }

  const hideMenu = () => setMenuOpen(false)

  return (
    <>
      <div ref={anchorRef}>
        <MoreButton
          ref={anchorRef}
          aria-controls="more-menu"
          aria-haspopup="true"
          onClick={toggleMenu}
        />
      </div>
      <ActionMenu
        id="more-menu"
        ref={anchorRef}
        open={isMenuOpen}
        actions={makeActions(actions)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        autoClose
        onClose={hideMenu}
      />
    </>
  )
}

MoreMenu.propTypes = {
  actions: PropTypes.func.isRequired
}

export default MoreMenu
