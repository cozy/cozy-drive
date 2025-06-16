import React from 'react'

import ActionsMenu from 'cozy-ui/transpiled/react/ActionsMenu'

import RightClickMenu from '@/components/RightClick/RightClickMenu'
import RightClickProvider, {
  useRightClick
} from '@/components/RightClick/RightClickProvider'

const FileMenu = ({ docs, actions, position, onClose }) => {
  return (
    <ActionsMenu
      open
      docs={docs}
      actions={actions}
      anchorReference="anchorPosition"
      anchorPosition={{ top: position.mouseY, left: position.mouseX }}
      autoClose
      onClose={onClose}
    />
  )
}

const RightClickFileMenuWrapper = ({ docs, actions, children }) => {
  const { position, isOpen, onClose } = useRightClick()

  return (
    <>
      <RightClickMenu>{children}</RightClickMenu>
      {isOpen && (
        <FileMenu
          docs={docs}
          actions={actions}
          position={position}
          onClose={onClose}
        />
      )}
    </>
  )
}

const RightClickFileMenu = ({ docs, actions, disabled, children }) => {
  if (disabled) return children

  return (
    <RightClickProvider>
      <RightClickFileMenuWrapper docs={docs} actions={actions}>
        {children}
      </RightClickFileMenuWrapper>
    </RightClickProvider>
  )
}

export default RightClickFileMenu
