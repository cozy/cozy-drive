import get from 'lodash/get'

import IconFolder from 'cozy-ui/transpiled/react/Icons/FileTypeFolder'
import IconAudio from 'cozy-ui/transpiled/react/Icons/FileTypeAudio'
import IconBin from 'cozy-ui/transpiled/react/Icons/FileTypeBin'
import IconCode from 'cozy-ui/transpiled/react/Icons/FileTypeCode'
import IconFiles from 'cozy-ui/transpiled/react/Icons/FileTypeFiles'
import IconImage from 'cozy-ui/transpiled/react/Icons/FileTypeImage'
import IconPdf from 'cozy-ui/transpiled/react/Icons/FileTypePdf'
import IconSlide from 'cozy-ui/transpiled/react/Icons/FileTypeSlide'
import IconSheet from 'cozy-ui/transpiled/react/Icons/FileTypeSheet'
import IconText from 'cozy-ui/transpiled/react/Icons/FileTypeText'
import IconVideo from 'cozy-ui/transpiled/react/Icons/FileTypeVideo'
import IconZip from 'cozy-ui/transpiled/react/Icons/FileTypeZip'
import IconNote from 'cozy-ui/transpiled/react/Icons/FileTypeNote'

import { getFileMimetype } from 'drive/lib/getFileMimetype'

const getMimeTypeIcon = (isDirectory, name, mime) => {
  if (isDirectory) {
    return IconFolder
  } else if (/\.cozy-note$/.test(name)) {
    return IconNote
  } else {
    const iconsByMimeType = {
      audio: IconAudio,
      bin: IconBin,
      code: IconCode,
      image: IconImage,
      pdf: IconPdf,
      slide: IconSlide,
      sheet: IconSheet,
      text: IconText,
      video: IconVideo,
      zip: IconZip
    }
    const type = getFileMimetype(iconsByMimeType)(mime, name)
    return get(iconsByMimeType, type, IconFiles)
  }
}

export default getMimeTypeIcon
