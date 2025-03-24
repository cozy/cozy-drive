import React from 'react'
import ToggleButton from 'cozy-ui/transpiled/react/ToggleButton'
import ToggleButtonGroup from 'cozy-ui/transpiled/react/ToggleButtonGroup'
import Icon from 'cozy-ui/transpiled/react/Icon'
import ListMinIcon from 'cozy-ui/transpiled/react/Icons/ListMin'
import MosaicMinIcon from 'cozy-ui/transpiled/react/Icons/MosaicMin'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

/**
 * ViewSwitcher component for toggling between grid and list views
 * @param {Object} props - Component props
 * @param {boolean} props.isBigThumbnail - Whether the thumbnail size is big (grid view)
 * @param {Function} props.toggleThumbnailSize - Function to toggle the thumbnail size
 * @param {string} props.className - Additional CSS class name
 * @returns {JSX.Element} The rendered component
 */
const ViewSwitcher = ({ isBigThumbnail, toggleThumbnailSize, className }) => {
  const { t } = useI18n()

  // Convert isBigThumbnail to value for ToggleButtonGroup
  const value = isBigThumbnail ? 'grid' : 'list'

  const handleChange = (event, newValue) => {
    if (newValue !== null) {
      // If the new value is different from the current value, call toggleThumbnailSize
      if ((newValue === 'grid' && !isBigThumbnail) ||
          (newValue === 'list' && isBigThumbnail)) {
        toggleThumbnailSize()
      }
    }
  }

  return (
    <ToggleButtonGroup
      value={value}
      exclusive
      onChange={handleChange}
      aria-label={t('table.head_view_mode')}
      size="small"
      className={className}
      variant="rounded"
    >
      <ToggleButton
        value="list"
        aria-label={t('table.head_view_list')}
        rounded={true}
        color="default"
      >
        <Icon icon={ListMinIcon} />
      </ToggleButton>
      <ToggleButton
        value="grid"
        aria-label={t('table.head_view_grid')}
        rounded={true}
        color="default"
      >
        <Icon icon={MosaicMinIcon} />
      </ToggleButton>
    </ToggleButtonGroup>
  )
}

export default ViewSwitcher
