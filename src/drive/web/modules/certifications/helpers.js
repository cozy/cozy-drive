import filter from 'lodash/filter'

export const filterCertificationColumns = additionalColumns =>
  filter(additionalColumns, column => column.condition === true)
