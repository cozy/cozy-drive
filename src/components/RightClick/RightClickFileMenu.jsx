import React from 'react'

import ActionsMenu from 'cozy-ui/transpiled/react/ActionsMenu'
import { useBreakpoints } from 'cozy-ui/transpiled/react/providers/Breakpoints'

import { useRightClick } from '@/components/RightClick/RightClickProvider'

const RightClickFileMenu = ({ doc, actions, disabled, children, ...props }) => {
  const { position, isOpen, onOpen, onClose } = useRightClick()
  const { isDesktop } = useBreakpoints()

  if (!children) return null
  if (disabled || !isDesktop)
    return React.Children.map(children, child =>
      React.isValidElement(child)
        ? React.cloneElement(child, {
            ...props
          })
        : null
    )

  return (
    <>
      {React.Children.map(children, child =>
        React.isValidElement(child)
          ? React.cloneElement(child, {
              ...props,
              onContextMenu: ev => {
                onOpen(ev, `FileMenu-${doc._id}`)
              }
            })
          : null
      )}
      {isOpen(`FileMenu-${doc._id}`) && (
        <ActionsMenu
          open
          docs={[doc]}
          actions={actions}
          anchorReference="anchorPosition"
          anchorPosition={{ top: position.mouseY, left: position.mouseX }}
          autoClose
          onClose={onClose}
        />
      )}
    </>
  )
}

export default RightClickFileMenu
