import get from 'lodash/get'
import { getFileMimetype } from 'drive/lib/getFileMimetype'

import IconFolder from 'drive/assets/icons/icon-type-folder.svg'
import IconAudio from 'drive/assets/icons/icon-type-audio.svg'
import IconBin from 'drive/assets/icons/icon-type-bin.svg'
import IconCode from 'drive/assets/icons/icon-type-code.svg'
import IconFiles from 'drive/assets/icons/icon-type-files.svg'
import IconImage from 'drive/assets/icons/icon-type-image.svg'
import IconPdf from 'drive/assets/icons/icon-type-pdf.svg'
import IconSlide from 'drive/assets/icons/icon-type-slide.svg'
import IconSheet from 'drive/assets/icons/icon-type-sheet.svg'
import IconText from 'drive/assets/icons/icon-type-text.svg'
import IconVideo from 'drive/assets/icons/icon-type-video.svg'
import IconZip from 'drive/assets/icons/icon-type-zip.svg'
import IconNote from 'drive/assets/icons/icon-type-note.svg'

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
