import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import palette from 'cozy-ui/react/palette'
import { Icon } from 'cozy-ui/react'

import styles from '../styles.styl'
//TODO Wait for https://github.com/cozy/cozy-ui/pull/1182 to be merged

import IconFile from 'drive/assets/icons/icons-files-bi-color.svg'

const CategoryGridItem = ({ isSelected, icon, label }) => {
  return (
    <div
      className={classNames('u-pt-1 u-pb-half u-ph-half u-bxz  u-ellipsis', {
        [styles['border-selected']]: isSelected,
        [styles['border-not-selected']]: !isSelected
      })}
    >
      <div className="u-pos-relative">
        <Icon
          icon={IconFile}
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
      <span className="u-fz-tiny">{label}</span>
    </div>
  )
}
CategoryGridItem.propTypes = {
  isSelected: PropTypes.bool.isRequired,
  icon: PropTypes.string,
  label: PropTypes.string.isRequired
}

export default CategoryGridItem
