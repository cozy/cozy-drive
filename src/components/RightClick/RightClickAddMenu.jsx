import React, { useContext } from 'react'

import { useSharingContext } from 'cozy-sharing'

import RightClickMenu from '@/components/RightClick/RightClickMenu'
import RightClickProvider, {
  useRightClick
} from '@/components/RightClick/RightClickProvider'
import { useDisplayedFolder } from '@/hooks'
import AddMenuProvider, {
  AddMenuContext
} from '@/modules/drive/AddMenu/AddMenuProvider'

const AddMenu = ({ children }) => {
  const { handleToggle, handleOfflineClick, isOffline } =
    useContext(AddMenuContext)

  return (
    <RightClickMenu onOpen={isOffline ? handleOfflineClick : handleToggle}>
      {children}
    </RightClickMenu>
  )
}

const AddMenuWrapper = ({ children }) => {
  const { isOpen, position } = useRightClick()
  const { displayedFolder } = useDisplayedFolder()
  const { hasWriteAccess } = useSharingContext()

  const isFolderReadOnly = displayedFolder
    ? !hasWriteAccess(displayedFolder._id)
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
          anchorPosition: isOpen
            ? { top: position.mouseY, left: position.mouseX }
            : undefined
        }
      }}
    >
      <AddMenu>{children}</AddMenu>
    </AddMenuProvider>
  )
}

const RightClickAddMenu = ({ children }) => {
  return (
    <RightClickProvider>
      <AddMenuWrapper>{children}</AddMenuWrapper>
    </RightClickProvider>
  )
}

export default RightClickAddMenu
