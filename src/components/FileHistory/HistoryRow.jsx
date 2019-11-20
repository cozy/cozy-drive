import React from 'react'
import cx from 'classnames'
import PropTypes from 'prop-types'
import { Media, Bd, Img } from 'cozy-ui/transpiled/react/Media'
import { Caption, SubTitle, Bold } from 'cozy-ui/transpiled/react/Text'
import { Icon, Circle } from 'cozy-ui/transpiled/react'
import palette from 'cozy-ui/react/palette'

import styles from './styles.styl'

//@todo this component will be moved to UI when polished with an HistoryTimeLine
/**
 *
 * This component is heavily based on CompositeRow but it differs in several way:
 * can have three text : Primary / Secondary and Tag
 */
const HistoryRow = ({
  style,
  primaryText,
  secondaryText,
  image,
  actions,
  tag,
  downloadLink,
  ...rest
}) => {
  return (
    <Media
      className={cx(styles.HistoryRowMedia, 'u-p-1')}
      style={style}
      {...rest}
    >
      <div className="u-media u-media-grow u-row-m">
        <div className={styles.HistoryRowCircleWrapper}>
          <Img className={styles.HistoryRowMediaImg}>
            <Circle
              size={tag ? 'small' : 'xsmall'}
              backgroundColor="var(--white)"
              className={styles.HistoryRowCirle}
            >
              {tag && <Icon icon={image} color={palette.slateGrey} />}
            </Circle>
          </Img>
        </div>
        <div className="u-media-grow u-stack-xs ">
          <div className="u-media u-row-m">
            <Bd>
              <Bold>{primaryText}</Bold>
              <SubTitle>{tag}</SubTitle>
            </Bd>
            <Img>
              <Icon
                className="u-c-pointer"
                color="var(--coolGrey)"
                icon="download"
                onClick={() => downloadLink()}
              />
            </Img>
          </div>
          {secondaryText ? <Caption>{secondaryText}</Caption> : null}

          {actions}
        </div>
      </div>
    </Media>
  )
}

HistoryRow.propTypes = {
  /** Custom CSS */
  style: PropTypes.object,
  /** title  */
  title: PropTypes.string,
  /** First line */
  primaryText: PropTypes.string,
  /** Second line */
  secondaryText: PropTypes.string,
  /** Image to the left of the row */
  image: PropTypes.string,
  /**
   * Actions are shown below primary and secondary texts. Pass fragment for multiple elements.
   * Good to use with Chips.
   */
  actions: PropTypes.element,
  /* Element(s) to the show to the right of the CompositeRow */
  right: PropTypes.element
}

export default HistoryRow
