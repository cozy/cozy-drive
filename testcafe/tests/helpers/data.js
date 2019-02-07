import { getCurrentDateTime } from './utils'

// data filled during tests
export let sharingLink = ''
export const FOLDER_DATE_TIME = `Folder_${getCurrentDateTime()}`

// data files & path
const homedir = require('os').homedir
export const DOWNLOAD_PATH = `${homedir()}/Downloads`
export const DOWNLOAD_FILE_PATH = `${DOWNLOAD_PATH}/files.zip`

export const DATA_PATH = '../../data/' //all files in testcafe/data
//Drive
export const FILE_PDF = '[cozy]QA_table_ APPS.pdf'
export const FILE_XLSX = '[cozy]QA_table_ APPS.xlsx'

//Photos
export const IMG0 = 'IMG0.jpg'
export const IMG1 = 'IMG-JPG.jpg'
export const IMG2 = 'IMG-PNG.png'
export const IMG3 = 'IMG-GIF.gif'
