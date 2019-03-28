import React from 'react'
import { Icon } from 'cozy-ui/transpiled/react'

import IconFiles from '../icons/icon-type-files.svg'
import IconBin from '../icons/icon-type-bin.svg'
import IconCode from '../icons/icon-type-code.svg'
import IconSpreadsheet from '../icons/icon-type-sheet.svg'
import IconSlide from '../icons/icon-type-slide.svg'
import IconText from '../icons/icon-type-text.svg'
import IconZip from '../icons/icon-type-zip.svg'
import IconPdf from '../icons/icon-type-pdf.svg'

const FileIcon = ({ type }) => {
  let icon

  switch (type) {
    case 'bin':
      icon = IconBin
      break
    case 'code':
      icon = IconCode
      break
    case 'spreadsheet':
      icon = IconSpreadsheet
      break
    case 'slide':
      icon = IconSlide
      break
    case 'text':
      icon = IconText
      break
    case 'zip':
      icon = IconZip
      break
    case 'pdf':
      icon = IconPdf
      break
    default:
      icon = IconFiles
      break
  }

  return <Icon icon={icon} width={160} height={140} />
}

export default FileIcon
