import { useEffect } from 'react'

import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'

/**
 *  Since we are not able to restore the scroll correctly,
 * and force the scroll to top every time we change the
 * current folder. This is to avoid this kind of weird
 * behavior:
 * - If I go to a sub-folder, if this subfolder has a lot
 * of data and I scrolled down until the bottom. If I go
 * back, then my folder will also be scrolled down.
 *
 * This is an ugly hack, yeah.
 * */
const useScrollToTop = folderId => {
  const { isDesktop } = useBreakpoints()
  useEffect(() => {
    if (isDesktop) {
      const scrollable = document.querySelectorAll(
        '[data-testid=fil-content-body]'
      )[0]
      if (scrollable) {
        scrollable.scroll({ top: 0 })
      }
    } else {
      window.scroll({ top: 0 })
    }
  }, [isDesktop, folderId])
}

export { useScrollToTop }
