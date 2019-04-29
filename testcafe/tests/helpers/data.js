import { getCurrentDateTime } from './utils'
import path from 'path'

// data filled during tests
export let sharingLink = ''

export const FOLDER_DATE_TIME = `Folder_${getCurrentDateTime()}`
export const ALBUM_DATE_TIME = `Album_${getCurrentDateTime()}`
// data files & path
const homedir = require('os').homedir
export const DOWNLOAD_PATH = `${homedir()}/Downloads`
export const DOWNLOAD_FOLDER_PATH = `${DOWNLOAD_PATH}/files.zip`
export const filesList = []

//Path to Zip file
export const DATA_ZIP_PATH = path.resolve('./testcafe/data/files-to-test.zip')
//Path where the zip is extract & other data
export const DATA_PATH = path.resolve('./testcafe/data')
export const FILE_FROM_ZIP_PATH = path.join(DATA_PATH, 'FILES TO TEST')

//Drive : Those const are files from DATA_ZIP_PATH. If changing files in zip, dont forget to modify those const too!
export const FILE_PDF = 'Cozy Drive for Desktop.pdf'
export const FILE_XLSX = 'tests.xlsx'
export const FILE_ZIP = 'archive.zip'
export const FILE_PPTX = 'presentation.pptx'
export const FILE_IMG = 'IMG_1647.JPG'
export const FILE_AUDIO = 'Z.mp3'
export const FILE_VIDEO = 'Nextcloud.mp4'
export const FILE_TXT = 'notes.md'

//Photos
export const IMG0 = 'IMG0.jpg'
export const IMG1 = 'IMG-JPG.jpg'
export const IMG2 = 'IMG-PNG.png'
export const IMG3 = 'IMG-GIF.gif'
export const IMG4 = 'IMG1.jpg'

//Files types (For viewer testing)
export const pdfFilesExt = ['pdf']
export const audioFilesExt = ['mp3']
export const videoFilesExt = ['mp4', 'mov']
export const textFilesExt = ['vcf', 'csv', 'rtf', 'txt', 'md']
export const imageFilesExt = ['gif', 'jpg', 'jpeg', 'png']
export const allSpecialFilesExt = pdfFilesExt
  .concat(audioFilesExt)
  .concat(videoFilesExt)
  .concat(textFilesExt)
  .concat(imageFilesExt)

export const THUMBNAIL_DELAY = 3000
export const VR_STATUS_DELAY = 3000
export const VR_UPLOAD_DELAY = 5000
export const DOWNLOAD_DELAY = 5000

//Mask Coordonnates
export const maskDriveFolderWithDate = {
  height: 935,
  x: 916,
  width: 140,
  y: 248
}
export const maskShareFolder = { height: 918, x: 916, width: 140, y: 520 }
export const maskSharedWholePublicFolder = {
  height: 960,
  x: 800,
  width: 140,
  y: 180
}
export const maskAudioViewerDesktop = { height: 30, x: 929, width: 100, y: 620 }
export const maskAudioViewerMobile = { height: 30, x: 155, width: 99, y: 413 }

export const maskVideoViewerDesktop = { height: 40, x: 720, width: 484, y: 617 }
export const maskVideoViewerMobile = { height: 25, x: 12, width: 353, y: 381 }

export const maskDeleteFolder = { height: 918, x: 916, width: 140, y: 300 }
export const maskMoveMoadal = { height: 115, x: 905, width: 140, y: 237 }
export const maskPhotosCluster = { height: 43, x: 242, width: 424, y: 203 }
