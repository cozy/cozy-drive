import PropTypes from 'prop-types'
import React from 'react'

import Circle from 'cozy-ui/transpiled/react/Circle'
import GridList from 'cozy-ui/transpiled/react/GridList'
import GridListTile from 'cozy-ui/transpiled/react/GridListTile'
import Icon from 'cozy-ui/transpiled/react/Icon'
import IconButton from 'cozy-ui/transpiled/react/IconButton'
import CheckIcon from 'cozy-ui/transpiled/react/Icons/Check'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'

export const COLORS = [
  '#696c6f',
  '#d3bfa4',
  '#e1e3e6',
  '#ff4d5e',
  '#ff7750',
  '#f5ac00',
  '#ffd54c',
  '#ffe082',
  '#006bd8',
  '#46a2ff',
  '#91cef6',
  '#afffeb',
  '#2dd4ab',
  '#66e49a',
  '#6ad049',
  '#00bf62',
  '#713fa5',
  '#a777e8',
  '#ad95ff',
  '#bfa9ff',
  '#fba0b8',
  '#e694e0',
  '#e375cd',
  '#dbcac9'
]

const NB_COLUMNS_MOBILE = 6
const NB_COLUMNS_DESKTOP = 8
const CELL_HEIGHT_MOBILE = 56
const CELL_HEIGHT_DESKTOP = 40
const CIRCLE_SIZE_MOBILE = 40
const CIRCLE_SIZE_DESKTOP = 36
const ICON_SIZE_MOBILE = 18
const ICON_SIZE_DESKTOP = 12

/**
 * ColorPicker component - displays a grid of colors and allows the user to select one
 * @param {Object} props
 * @param {string} props.selectedColor - Currently selected color
 * @param {Function} props.onColorSelect - Callback function when a color is selected
 */
export const ColorPicker = ({ selectedColor, onColorSelect }) => {
  const { isMobile } = useBreakpoints()
  return (
    <>
      <GridList
        cols={isMobile ? NB_COLUMNS_MOBILE : NB_COLUMNS_DESKTOP}
        cellHeight={isMobile ? CELL_HEIGHT_MOBILE : CELL_HEIGHT_DESKTOP}
      >
        {COLORS.map(color => (
          <GridListTile key={color} className="u-ta-center">
            <Circle
              size={isMobile ? CIRCLE_SIZE_MOBILE : CIRCLE_SIZE_DESKTOP}
              backgroundColor={color}
            >
              <IconButton onClick={() => onColorSelect(color)}>
                {selectedColor === color && (
                  <Icon
                    size={isMobile ? ICON_SIZE_MOBILE : ICON_SIZE_DESKTOP}
                    icon={CheckIcon}
                    color="white"
                  />
                )}
              </IconButton>
            </Circle>
          </GridListTile>
        ))}
      </GridList>
    </>
  )
}

ColorPicker.propTypes = {
  selectedColor: PropTypes.string.isRequired,
  onColorSelect: PropTypes.func.isRequired
}

ColorPicker.displayName = 'ColorPicker'
