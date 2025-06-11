import React, { useContext, useState } from 'react'

import { useSharingContext } from 'cozy-sharing'
import ActionsMenu from 'cozy-ui/transpiled/react/ActionsMenu'
import {
  makeActions,
  modify,
  emailTo,
  print,
  viewInContacts,
  viewInDrive,
  divider,
  smsTo,
  call
} from 'cozy-ui/transpiled/react/ActionsMenu/Actions'
import Menu from 'cozy-ui/transpiled/react/Menu'
import MenuItem from 'cozy-ui/transpiled/react/MenuItem'
import { useBreakpoints } from 'cozy-ui/transpiled/react/providers/Breakpoints'

import { useDisplayedFolder } from '@/hooks'
import AddMenuProvider, {
  AddMenuContext
} from '@/modules/drive/AddMenu/AddMenuProvider'

const initialState = {
  mouseX: null,
  mouseY: null
}

const RightClickMenu = ({ children, setState, targetRef }) => {
  const { isDesktop } = useBreakpoints()
  const { handleToggle, handleOfflineClick, isOffline } =
    useContext(AddMenuContext)

  const handleClick = e => {
    e.preventDefault()
    e.stopPropagation()

    const isSameTarget = e.target.isEqualNode(targetRef?.current)

    if (!isSameTarget) return

    isOffline ? handleOfflineClick() : handleToggle()

    setState({
      mouseX: e.clientX - 2,
      mouseY: e.clientY - 4
    })
  }

  const handleClose = () => {
    setState(initialState)
  }

  if (!isDesktop) return children

  const actions = makeActions([
    modify,
    viewInContacts,
    viewInDrive,
    divider,
    call,
    smsTo,
    emailTo,
    print,
    divider
  ])

  return (
    <div
      className="u-dc"
      style={{ cursor: 'context-menu' }}
      onContextMenu={handleClick}
    >
      {children}

      {/* <ActionsMenu
        open={state.mouseY !== null}
        docs={[]}
        actions={actions}
        anchorReference="anchorPosition"
        anchorPosition={
          state.mouseY !== null && state.mouseX !== null
            ? { top: state.mouseY, left: state.mouseX }
            : undefined
        }
        autoClose
        onClose={handleClose}
      /> */}
      {/* <Menu
        keepMounted
        open={state.mouseY !== null}
        onClose={handleClose}
        anchorReference="anchorPosition"
        anchorPosition={
          state.mouseY !== null && state.mouseX !== null
            ? { top: state.mouseY, left: state.mouseX }
            : undefined
        }
      >
        <MenuItem onClick={handleClose}>Copy</MenuItem>
        <MenuItem onClick={handleClose}>Print</MenuItem>
        <MenuItem onClick={handleClose}>Highlight</MenuItem>
        <MenuItem onClick={handleClose}>Email</MenuItem>
      </Menu> */}
    </div>
  )
}

const RightClickMenuWrapper = ({ children, targetRef }) => {
  const [state, setState] = useState(initialState)
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
          anchorPosition:
            state.mouseY !== null && state.mouseX !== null
              ? { top: state.mouseY, left: state.mouseX }
              : undefined
        }
      }}
    >
      <RightClickMenu targetRef={targetRef} setState={setState}>
        {children}
      </RightClickMenu>
    </AddMenuProvider>
  )
}

export default RightClickMenuWrapper
