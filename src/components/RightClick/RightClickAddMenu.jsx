import React, { useContext } from 'react'

import { useSharingContext } from 'cozy-sharing'
import { useBreakpoints } from 'cozy-ui/transpiled/react/providers/Breakpoints'

import { useRightClick } from '@/components/RightClick/RightClickProvider'
import { useDisplayedFolder } from '@/hooks'
import AddMenuProvider, {
  AddMenuContext
} from '@/modules/drive/AddMenu/AddMenuProvider'

const AddMenu = ({ children, ...props }) => {
  const { isDesktop } = useBreakpoints()
  const { onOpen } = useRightClick()
  const { handleToggle, handleOfflineClick, isOffline } =
    useContext(AddMenuContext)

  if (!children) return null
  if (!isDesktop)
    return React.Children.map(children, child =>
      React.isValidElement(child)
        ? React.cloneElement(child, {
            ...props
          })
        : null
    )

  return React.Children.map(children, child =>
    React.isValidElement(child)
      ? React.cloneElement(child, {
          ...props,
          onContextMenu: ev => {
            if (isOffline) {
              handleOfflineClick()
            } else {
              onOpen(ev, `AddMenu`)
              handleToggle()
            }
          }
        })
      : null
  )
}

const RightClickAddMenu = ({ children, ...props }) => {
  const { isOpen, position } = useRightClick()
  const { displayedFolder } = useDisplayedFolder()
  const { hasWriteAccess } = useSharingContext()

  const isFolderReadOnly = displayedFolder
    ? !hasWriteAccess(displayedFolder._id, displayedFolder.driveId)
    : false

  return (
    <AddMenuProvider
      canCreateFolder={true}
      canUpload={true}
      disabled={false}
      displayedFolder={displayedFolder}
      isSelectionBarVisible={false}
      isReadOnly={isFolderReadOnly}
      componentsProps={{
        AddMenu: {
          anchorReference: 'anchorPosition',
          anchorPosition: isOpen('AddMenu')
            ? { top: position.mouseY, left: position.mouseX }
            : undefined
        }
      }}
    >
      <AddMenu {...props}>{children}</AddMenu>
    </AddMenuProvider>
  )
}

export default RightClickAddMenu
