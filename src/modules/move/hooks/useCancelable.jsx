import { useEffect, useRef, useCallback } from 'react'

import { cancelable } from 'cozy-client'

const useCancelable = () => {
  const promisesRef = useRef([])

  useEffect(() => {
    // Cleanup function to cancel all promises
    return () => {
      promisesRef.current.forEach(p => p.cancel())
      promisesRef.current = []
    }
  }, [])

  const registerCancelable = useCallback(promise => {
    const cancelableP = cancelable(promise)
    promisesRef.current.push(cancelableP)
    return cancelableP
  }, [])

  return {
    registerCancelable
  }
}

export { useCancelable }
