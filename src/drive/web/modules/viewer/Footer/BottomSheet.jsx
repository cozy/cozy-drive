import React, { useState, useEffect, useRef } from 'react'
import { BottomSheet } from 'mui-bottom-sheet'
import { makeStyles } from '@material-ui/core/styles'

import flag from 'cozy-flags'

const useStyles = ({ isTopPosition }) => ({
  root: {
    borderTopLeftRadius: '1rem',
    borderTopRightRadius: '1rem',
    transition: 'border-radius 0.5s',
    boxShadow: '0 6px 16px 0 rgba(0, 0, 0, 0.5)',
    ...(isTopPosition && {
      borderTopLeftRadius: 0,
      borderTopRightRadius: 0
    })
  }
})

const useClasses = makeStyles(theme => ({
  header: {
    height: '2.5rem',
    width: '100%',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  indicator: {
    width: '4rem',
    height: '0.25rem',
    borderRadius: '99px',
    backgroundColor: theme.palette.text.secondary
  }
}))

export const defaultBottomSheetSpringConfig = {
  tension: 165,
  friction: 17,
  clamp: true
}

const BottomSheetWrapper = ({
  file,
  actionButtonsRef,
  toolbarRef,
  children
}) => {
  const [isTopPosition, setIsTopPosition] = useState(false)
  const [peekHeights, setPeekHeights] = useState(null)
  const [initPos, setInitPos] = useState(null)
  const [bottomSpacerHeight, setBottomSpacerHeight] = useState(0)
  const classes = useClasses()
  const styles = useStyles({ isTopPosition })
  const innerContentRef = useRef()
  const headerRef = useRef()

  const toolbar = toolbarRef.current

  useEffect(() => {
    const maxHeight = toolbar
      ? window.innerHeight - toolbar.offsetHeight
      : window.innerHeight
    const mediumHeight = Math.round(maxHeight * 0.33)
    const actionButtonsHeight = parseFloat(
      getComputedStyle(actionButtonsRef.current).getPropertyValue('height')
    )
    const actionButtonsBottomMargin = 16
    const minHeight =
      headerRef.current.offsetHeight +
      actionButtonsHeight +
      actionButtonsBottomMargin

    // Used so that the bottomSheet can be opened to the top,
    // without stopping at the content height
    const bottomSpacerHeight = maxHeight - innerContentRef.current.offsetHeight

    setPeekHeights([minHeight, mediumHeight, maxHeight])
    setInitPos(mediumHeight)
    setBottomSpacerHeight(bottomSpacerHeight)
  }, [toolbar, innerContentRef, file, actionButtonsRef])

  const handleOnIndexChange = snapIndex => {
    const maxHeightSnapIndex = peekHeights.length - 1

    if (snapIndex === maxHeightSnapIndex && !isTopPosition) {
      setIsTopPosition(true)
    }
    if (snapIndex !== maxHeightSnapIndex && isTopPosition) {
      setIsTopPosition(false)
    }
  }

  return (
    <BottomSheet
      peekHeights={peekHeights}
      defaultHeight={initPos}
      backdrop={false}
      fullHeight={false}
      onIndexChange={snapIndex => handleOnIndexChange(snapIndex)}
      styles={{ root: styles.root }}
      threshold={0}
      // springConfig doc : https://www.react-spring.io/docs/hooks/api
      springConfig={{
        tension:
          typeof flag('viewer-bottomSheet-tension') === 'number'
            ? flag('viewer-bottomSheet-tension')
            : defaultBottomSheetSpringConfig.tension,
        friction:
          typeof flag('viewer-bottomSheet-friction') === 'number'
            ? flag('viewer-bottomSheet-friction')
            : defaultBottomSheetSpringConfig.friction,
        clamp:
          typeof flag('viewer-bottomSheet-clamp') === 'boolean'
            ? flag('viewer-bottomSheet-clamp')
            : defaultBottomSheetSpringConfig.clamp
      }}
      disabledClosing={true}
      snapPointSeekerMode="next"
    >
      <div ref={innerContentRef}>
        <div
          data-testid="bottomSheet-header"
          className={classes.header}
          ref={headerRef}
        >
          <div className={classes.indicator} />
        </div>
        {children}
      </div>
      <div style={{ height: bottomSpacerHeight }} />
    </BottomSheet>
  )
}

export default BottomSheetWrapper
