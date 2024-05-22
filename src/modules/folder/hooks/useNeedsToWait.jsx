import { useEffect, useState } from 'react'

/**
 * When we mount the component when we already have data in cache,
 * the mount is time consuming since we'll render at least 100 lines
 * of File.
 *
 * React seems to batch together the fact that :
 * - we change a route
 * - we want to render 100 files
 * resulting in a non smooth transition between views (Drive / Recent / ...)
 *
 * In order to bypass this batch, we use a state to first display a much
 * more simpler component and then the files
 */
const useNeedsToWait = ({ isLoading }) => {
  const [needsToWait, setNeedsToWait] = useState(true)
  useEffect(() => {
    let timeout = null
    if (!isLoading) {
      timeout = setTimeout(() => {
        setNeedsToWait(false)
      }, 50)
    }
    return () => clearTimeout(timeout)
  }, [isLoading])
  return needsToWait
}

export { useNeedsToWait }
