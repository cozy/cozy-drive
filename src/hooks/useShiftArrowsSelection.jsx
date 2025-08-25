import { useEffect, useRef } from 'react'

import { useSelectionContext } from '@/modules/selection/SelectionProvider'

const useShiftArrowsSelection = ({ items, viewType = 'list' }, ref) => {
  const { setItemsList, handleShiftArrow } = useSelectionContext()
  const viewTypeRef = useRef()

  useEffect(() => {
    viewTypeRef.current = viewType
  }, [viewType])

  useEffect(() => {
    setItemsList(items)
  }, [items, setItemsList])

  useEffect(() => {
    if (!ref?.current) return
    const table = ref.current
    ref.current.focus()

    const handleKeyDown = event => {
      if (
        event.shiftKey &&
        ((viewTypeRef.current === 'list' &&
          (event.key === 'ArrowUp' || event.key === 'ArrowDown')) ||
          (viewTypeRef.current === 'grid' &&
            (event.key === 'ArrowRight' || event.key === 'ArrowLeft')))
      ) {
        event.preventDefault()
        const direction =
          event.key === 'ArrowUp' || event.key === 'ArrowLeft' ? -1 : 1
        handleShiftArrow(direction)
      }
    }

    table.addEventListener('keydown', handleKeyDown)
    return () => {
      table.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleShiftArrow, ref])
}

export { useShiftArrowsSelection }
