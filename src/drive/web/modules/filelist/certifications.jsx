import React from 'react'
import filter from 'lodash/filter'

import Icon from 'cozy-ui/transpiled/react/Icon'

import iconCertified from 'drive/assets/icons/icon-certified.svg'
import iconSafe from 'drive/assets/icons/icon-safe.svg'

export const filterCertificationColumns = additionalColumns =>
  filter(additionalColumns, column => column.condition === true)

export const makeCarbonCopy = condition => ({
  condition,
  className: '',
  label: 'carbonCopy',
  icon: <Icon icon={iconCertified} size={16} />,
  tooltip: true
})

export const makeElectronicSafe = condition => ({
  condition,
  className: '',
  label: 'electronicSafe',
  icon: <Icon icon={iconSafe} size={16} />,
  tooltip: true
})
