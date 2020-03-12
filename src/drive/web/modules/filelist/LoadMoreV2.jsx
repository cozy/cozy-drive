import React, { useState, useEffect, useRef, useCallback } from 'react'
import PropTypes from 'prop-types'
import { Button, Spinner } from 'cozy-ui/transpiled/react'

require('intersection-observer') // polyfill for safari

const LoadMore = ({ fetchMore, text }) => {
  const [isLoading, setIsLoading] = useState(false)
  const elementRef = useRef()

  const startFetchMore = useCallback(
    async () => {
      if (!isLoading) {
        setIsLoading(true)
        try {
          await fetchMore()
        } catch (error) {
          console.warn('failed to load more', error)
        } finally {
          setIsLoading(false)
        }
      }
    },
    [isLoading, fetchMore]
  )

  const checkIntersectionsEntries = intersectionEntries => {
    if (intersectionEntries.filter(entry => entry.isIntersecting).length > 0)
      startFetchMore()
  }

  useEffect(() => {
    const observer = new IntersectionObserver(checkIntersectionsEntries)
    observer.observe(elementRef.current)

    return () => {
      observer.unobserve(elementRef.current)
      observer.disconnect()
    }
  })

  return (
    <span ref={elementRef}>
      <Button
        theme="text"
        onClick={startFetchMore}
        label={isLoading ? <Spinner noMargin /> : text}
      />
    </span>
  )
}

LoadMore.propTypes = {
  fetchMore: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired
}

export default LoadMore
