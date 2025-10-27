import PropTypes from 'prop-types'
import React from 'react'

import GridList from 'cozy-ui/transpiled/react/GridList'
import GridListTile from 'cozy-ui/transpiled/react/GridListTile'
import Icon from 'cozy-ui/transpiled/react/Icon'
import IconButton from 'cozy-ui/transpiled/react/IconButton'
import Typography from 'cozy-ui/transpiled/react/Typography'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import { getIcon, getIconList } from './IconIndex'

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
export const IconPicker = ({ selectedIcon, onIconSelect }) => {
  const { isMobile } = useBreakpoints()
  const { t } = useI18n()
  const icons = getIconList()

  return (
    <>
      <Typography className="u-ml-half u-mb-1 u-mt-2" variant="h6" noWrap>
        {t('FolderCustomizer.iconPicker.chooseCustomIcon')}
      </Typography>
      <GridList
        cols={isMobile ? NB_COLUMNS_MOBILE : NB_COLUMNS_DESKTOP}
        cellHeight={isMobile ? CELL_HEIGHT_MOBILE : CELL_HEIGHT_DESKTOP}
      >
        {icons.map((iconName, index) => (
          <GridListTile key={index} className="u-ta-center">
            <IconButton
              onClick={() => onIconSelect(iconName)}
              size={isMobile ? ICON_SIZE_MOBILE : ICON_SIZE_DESKTOP}
              className={selectedIcon === iconName ? 'u-bg-silver' : ''}
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
  )
}

IconPicker.propTypes = {
  selectedIcon: PropTypes.string,
  onIconSelect: PropTypes.func.isRequired
}

IconPicker.displayName = 'IconPicker'
