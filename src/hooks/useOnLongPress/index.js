import { useRef, useState } from 'react'

import { useBreakpoints } from 'cozy-ui/transpiled/react/providers/Breakpoints'

import { makeDesktopHandlers, makeMobileHandlers } from './helpers'

import { useSelectionContext } from '@/modules/selection/SelectionProvider'

export const useLongPress = ({
  file,
  disabled,
  isRenaming,
  openLink,
  toggle
}) => {
  const timerId = useRef()
  const isLongPress = useRef(false)
  const [lastClickTime, setLastClickTime] = useState(0)
  const { isDesktop } = useBreakpoints()
  const {
    setSelectedItems,
    setFocusedIndex,
    setLastSelectedIndex,
    clearSelection,
    isSelectionBarVisible: selectionModeActive
  } = useSelectionContext()

  if (isDesktop) {
    return makeDesktopHandlers({
      file,
      timerId,
      disabled,
      isRenaming,
      openLink,
      lastClickTime,
      setLastClickTime,
      clearSelection,
      setSelectedItems,
      setLastSelectedIndex,
      setFocusedIndex
    })
  }

  return makeMobileHandlers({
    timerId,
    disabled,
    selectionModeActive,
    isRenaming,
    isLongPress,
    openLink,
    toggle
  })
}
