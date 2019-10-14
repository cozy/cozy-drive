import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import palette from 'cozy-ui/react/palette'
import { Icon } from 'cozy-ui/react'

import styles from '../styles.styl'

const CategoryGridItem = ({ isSelected, icon, theme, label }) => {
  return (
    <div
      className={classNames(
        styles['grid-item'],
        'u-pb-half u-ph-half u-bxz  u-ellipsis u-c-pointer',
        {
          [styles['border-selected']]: isSelected,
          [styles['grid-item__selected']]: isSelected,
          [styles['border-not-selected']]: !isSelected
        }
      )}
    >
      <div className="u-pos-relative">
        <Icon
          icon={'file-duotone'}
          size={'32'}
          color={isSelected ? palette.dodgerBlue : palette.coolGrey}
        />
        {icon && (
          <Icon
            icon={icon}
            color={isSelected ? palette.dodgerBlue : palette.coolGrey}
            size={'16'}
            className={classNames(styles['icon-absolute-centered'])}
          />
        )}
      </div>
      <div className="u-flex u-flex-column u-ellipsis u-bxz">
        <span className={classNames(styles['grid-item-theme'], 'u-ellipsis')}>
          {theme}
        </span>
        {label && (
          <span className={classNames(styles['grid-item-label'], 'u-ellipsis')}>
            {label}
          </span>
        )}
      </div>
    </div>
  )
}
CategoryGridItem.propTypes = {
  isSelected: PropTypes.bool.isRequired,
  icon: PropTypes.string,
  theme: PropTypes.string.isRequired,
  label: PropTypes.string
}

export default CategoryGridItem
