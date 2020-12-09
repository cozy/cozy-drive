import React from 'react'

import { CarbonCopy, ElectronicSafe } from './'

const OptionalCell = ({ tag, file }) => {
  const optionalColumns = {
    carbonCopy: CarbonCopy,
    electronicSafe: ElectronicSafe
  }
  const TagName = optionalColumns[tag]

  return <TagName file={file} />
}

export default OptionalCell
