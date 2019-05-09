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
