import React from 'react'

import { useBreakpoints } from 'cozy-ui/transpiled/react/providers/Breakpoints'

import { useRightClick } from '@/components/RightClick/RightClickProvider'

const RightClickMenu = ({ onOpen, children }) => {
  const { setPosition } = useRightClick()
  const { isDesktop } = useBreakpoints()

  if (!isDesktop) {
    return children
  }

  const handleClick = e => {
    e.preventDefault()
    e.stopPropagation()

    onOpen?.()

    setPosition({
      mouseX: e.clientX - 2,
      mouseY: e.clientY - 4
    })
  }

  return (
    <div
      className="u-dc"
      style={{ cursor: 'context-menu' }}
      onContextMenu={handleClick}
    >
      {children}
    </div>
  )
}

export default RightClickMenu
