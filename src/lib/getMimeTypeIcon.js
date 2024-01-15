import get from 'lodash/get'

import IconAudio from 'cozy-ui/transpiled/react/Icons/FileTypeAudio'
import IconBin from 'cozy-ui/transpiled/react/Icons/FileTypeBin'
import IconCode from 'cozy-ui/transpiled/react/Icons/FileTypeCode'
import IconFiles from 'cozy-ui/transpiled/react/Icons/FileTypeFiles'
import IconFolder from 'cozy-ui/transpiled/react/Icons/FileTypeFolder'
import IconImage from 'cozy-ui/transpiled/react/Icons/FileTypeImage'
import IconNote from 'cozy-ui/transpiled/react/Icons/FileTypeNote'
import IconPdf from 'cozy-ui/transpiled/react/Icons/FileTypePdf'
import IconSheet from 'cozy-ui/transpiled/react/Icons/FileTypeSheet'
import IconSlide from 'cozy-ui/transpiled/react/Icons/FileTypeSlide'
import IconText from 'cozy-ui/transpiled/react/Icons/FileTypeText'
import IconVideo from 'cozy-ui/transpiled/react/Icons/FileTypeVideo'
import IconZip from 'cozy-ui/transpiled/react/Icons/FileTypeZip'

import { getFileMimetype } from 'lib/getFileMimetype'
import IconEncryptedFolder from 'modules/views/Folder/EncryptedFolderIcon'

const getMimeTypeIcon = (
  isDirectory,
  name,
  mime,
  { isEncrypted = false } = {}
) => {
  if (isEncrypted) {
    return IconEncryptedFolder
  }
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
