import React from 'react'
import PropTypes from 'prop-types'
import { ContextHeader } from 'cozy-ui/react'
import DriveIcon from 'drive/assets/icons/icon-drive.svg'

const MoveHeader = ({ entries, onClose }, { t }) => (
  <ContextHeader
    title={entries[0].name}
    text={t('Move.to')}
    icon={DriveIcon}
    onClose={onClose}
  />
)

MoveHeader.propTypes = {
  entries: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string
    })
  ).isRequired,
  onClose: PropTypes.func.isRequired
}

export default MoveHeader
