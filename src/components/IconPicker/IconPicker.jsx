import PropTypes from 'prop-types'
import React, { useState } from 'react'

import Backdrop from 'cozy-ui/transpiled/react/Backdrop'
import GridList from 'cozy-ui/transpiled/react/GridList'
import GridListTile from 'cozy-ui/transpiled/react/GridListTile'
import Icon from 'cozy-ui/transpiled/react/Icon'
import IconButton from 'cozy-ui/transpiled/react/IconButton'
import { Spinner } from 'cozy-ui/transpiled/react/Spinner'
import Typography from 'cozy-ui/transpiled/react/Typography'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import { IconColorPicker, ICON_COLORS } from './IconColorPicker'
import { getIcon, getIconList } from './IconIndex'

import { useRecentIcons } from '@/hooks'

const NB_COLUMNS_MOBILE = 6
const NB_COLUMNS_DESKTOP = 8
const CELL_HEIGHT_MOBILE = 56
const CELL_HEIGHT_DESKTOP = 42
const ICON_SIZE_MOBILE = 20
const ICON_SIZE_DESKTOP = 18

/**
 * IconPicker component - displays a grid of icons and allows the user to select one
 * @param {Object} props
 * @param {string} props.selectedIcon - Currently selected icon
 * @param {Function} props.onIconSelect - Callback function when an icon is selected
 */

export const IconPicker = ({
  selectedIcon,
  onIconSelect,
  selectedIconColor,
  onIconColorSelect
}) => {
  const { isMobile } = useBreakpoints()
  const { t } = useI18n()
  const recentIcons = useRecentIcons()
  const icons = getIconList()
  const [anchorEl, setAnchorEl] = useState(null)

  const iconSize = isMobile ? ICON_SIZE_MOBILE : ICON_SIZE_DESKTOP

  const handleIconClick = (event, iconName) => {
    if (onIconColorSelect && iconName !== 'none') {
      setAnchorEl(prev => (prev ? null : event.currentTarget))
    }
    onIconSelect(iconName)
  }

  const handleColorPick = color => {
    onIconColorSelect?.(color)
    setAnchorEl(null)
  }

  if (!recentIcons) {
    return (
      <Backdrop isOver open>
        <Spinner size="xxlarge" middle noMargin color="var(--white)" />
      </Backdrop>
    )
  }

  return (
    <>
      {recentIcons.length > 0 && (
        <>
          <Typography className="u-ml-half u-mb-1" variant="h6" noWrap>
            {t('FolderCustomizer.iconPicker.recents')}
          </Typography>
          <GridList
            cols={isMobile ? NB_COLUMNS_MOBILE : NB_COLUMNS_DESKTOP}
            cellHeight={isMobile ? CELL_HEIGHT_MOBILE : CELL_HEIGHT_DESKTOP}
          >
            {recentIcons.map((iconName, index) => (
              <GridListTile key={`recent-${index}`} className="u-ta-center">
                <IconButton
                  onClick={() => onIconSelect(iconName)}
                  size={isMobile ? ICON_SIZE_MOBILE : ICON_SIZE_DESKTOP}
                >
                  <Icon
                    size={isMobile ? ICON_SIZE_MOBILE : ICON_SIZE_DESKTOP}
                    icon={getIcon(iconName)}
                    color="#555556"
                  />
                </IconButton>
              </GridListTile>
            ))}
          </GridList>
        </>
      )}
      <Typography
        className="u-ml-half u-mb-1 u-mt-1 u-mt-0-t"
        variant="h6"
        noWrap
      >
        {t('FolderCustomizer.iconPicker.chooseCustomIcon')}
      </Typography>
      <GridList
        cols={isMobile ? NB_COLUMNS_MOBILE : NB_COLUMNS_DESKTOP}
        cellHeight={isMobile ? CELL_HEIGHT_MOBILE : CELL_HEIGHT_DESKTOP}
      >
        {icons.map((iconName, index) => (
          <GridListTile key={index} className="u-ta-center">
            <IconButton
              onClick={e => handleIconClick(e, iconName)}
              size={iconSize}
              className={selectedIcon === iconName ? 'u-bg-silver' : ''}
            >
              <Icon
                size={iconSize}
                icon={getIcon(iconName)}
                color={
                  selectedIcon === iconName ? selectedIconColor : ICON_COLORS[0]
                }
              />
            </IconButton>
            {selectedIcon === iconName && Boolean(anchorEl) && (
              <IconColorPicker
                anchorEl={anchorEl}
                selectedIcon={selectedIcon}
                iconSize={iconSize}
                isMobile={isMobile}
                onPickColor={handleColorPick}
                onClose={() => setAnchorEl(null)}
              />
            )}
          </GridListTile>
        ))}
      </GridList>
    </>
  )
}

IconPicker.propTypes = {
  selectedIcon: PropTypes.string,
  onIconSelect: PropTypes.func.isRequired
}

IconPicker.displayName = 'IconPicker'
