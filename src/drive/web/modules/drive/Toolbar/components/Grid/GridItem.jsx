import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import styles from '../styles.styl'

class GridItem extends Component {
  render() {
    const { isSelected, onClick, children } = this.props
    return (
      <div
        className={classNames(
          'u-mr-half u-mb-half u-bxz u-bdrs-3 u-flex u-flex-column u-flex-justify-around',
          styles['grid-item'],
          {
            [styles['border-selected']]: isSelected,
            [styles['border-not-selected']]: !isSelected
          }
        )}
        onClick={() => onClick && onClick()}
      >
        {children}
      </div>
    )
  }
}
GridItem.propTypes = {
  isSelected: PropTypes.bool.isRequired,
  onClick: PropTypes.func,
  children: PropTypes.node.isRequired
}
export default GridItem
