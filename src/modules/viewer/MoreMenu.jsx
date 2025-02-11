import cx from 'classnames'
import React, { useState, useRef } from 'react'

import ActionsMenu from 'cozy-ui/transpiled/react/ActionsMenu'
import Icon from 'cozy-ui/transpiled/react/Icon'
import IconButton from 'cozy-ui/transpiled/react/IconButton'
import DotsIcon from 'cozy-ui/transpiled/react/Icons/Dots'
import { useBreakpoints } from 'cozy-ui/transpiled/react/providers/Breakpoints'

import { useMoreMenuActions } from '@/hooks/useMoreMenuActions'

const MoreMenu = ({ file }) => {
  const [showMenu, setShowMenu] = useState(false)
  const { isDesktop } = useBreakpoints()
  const anchorRef = useRef()
  const actions = useMoreMenuActions(file)

  if (file.trashed) return null

  return (
    <>
      <IconButton
        ref={anchorRef}
        variant="secondary"
        className={cx({ 'u-white': isDesktop })}
        onClick={() => setShowMenu(v => !v)}
      >
        <Icon icon={DotsIcon} />
      </IconButton>
      {showMenu && (
        <ActionsMenu
          open
          ref={anchorRef}
          docs={[file]}
          actions={actions}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right'
          }}
          autoClose
          onClose={() => setShowMenu(false)}
        />
      )}
    </>
  )
}

export default MoreMenu
