import { driveUser } from '../helpers/roles'
import logger from '../helpers/logger'
import {
  TESTCAFE_DRIVE_URL,
  setDownloadPath,
  getFilesWithExt,
  getFilesWithoutExt,
  checkLocalFile,
  deleteLocalFile
} from '../helpers/utils'
let data = require('../helpers/data')
import DrivePage from '../pages/drive/drive-model-private'
import ViewerPage from '../pages/drive-viewer/drive-viewer-model'

const drivePage = new DrivePage()
const viewerPage = new ViewerPage()

//************************
//Tests when authentified
//************************
fixture`Drive : Viewer features : prepare data`
  .page`${TESTCAFE_DRIVE_URL}/`.beforeEach(async t => {
  console.group(`\n↳ ℹ️  Login & Initialization`)
  await t.useRole(driveUser)
  await drivePage.waitForLoading()
  console.groupEnd()
})

test('Drive : Create a $test_date_time folder in Drive', async () => {
  console.group(`↳ ℹ️  Drive : Create a ${data.FOLDER_DATE_TIME} folder`)
  await drivePage.addNewFolder({ newFolderName: data.FOLDER_DATE_TIME })
  console.groupEnd()
})

test('Drive : Go to $test_date_time and upload 26 files', async () => {
  console.group(
    `↳ ℹ️  Drive : Go to ${data.FOLDER_DATE_TIME} and upload 26 files`
  )
  await drivePage.goToFolder(data.FOLDER_DATE_TIME)
  await drivePage.uploadFiles(data.filesList)
  console.groupEnd()
})

//************************
//Tests when authentified : with downloads
//************************
fixture`Drive : Viewer features (and Download)`
  .page`${TESTCAFE_DRIVE_URL}/`.beforeEach(async t => {
  console.group(
    `\n↳ ℹ️  Login, Page Initialization & data.DOWNLOAD_PATH initialization`
  )
  await t.useRole(driveUser)
  await drivePage.waitForLoading()
  await drivePage.goToFolder(data.FOLDER_DATE_TIME)
  await setDownloadPath(data.DOWNLOAD_PATH)
  console.groupEnd()
})

test('Viewer : checking common features for all files (expect PDF)', async t => {
  //Files count needed for navigation tests
  t.ctx.totalFilesCount = await drivePage.getContentRowCount(
    `${data.FOLDER_DATE_TIME} - Before`
  )
  // put all files names , execpt pdf in an array for testing commons features in viewer
  t.ctx.fileNameListNoPDF = await getFilesWithoutExt(
    data.FILE_FROM_ZIP_PATH,
    data.pdfFilesExt
  )
  for (let i = 0; i < t.ctx.fileNameListNoPDF.length; i++) {
    console.group(
      `\n↳ ℹ️  Viewer : checking commons features for ${
        t.ctx.fileNameListNoPDF[i]
      }`
    )
    await viewerPage.checkCommonViewerControls(
      data.FOLDER_DATE_TIME,
      t.ctx.fileNameListNoPDF[i]
    )
    await viewerPage.openFileAndCheckCommonViewerDownload(
      t.ctx.fileNameListNoPDF[i]
    )
    console.groupEnd()
  }
}).after(async t => {
  for (let i = 0; i < t.ctx.fileNameListNoPDF.length; i++) {
    logger.info(
      `↳ ℹ️  Viewer (Commons) - Checking downloaded files for ${
        t.ctx.fileNameListNoPDF[i]
      }`
    )
    await checkLocalFile(`${data.DOWNLOAD_PATH}/${t.ctx.fileNameListNoPDF[i]}`)
    await deleteLocalFile(`${data.DOWNLOAD_PATH}/${t.ctx.fileNameListNoPDF[i]}`)
  }
})

test('Viewer : no Viewer : other Download', async t => {
  t.ctx.fileNameListNoViewer = await getFilesWithoutExt(
    data.FILE_FROM_ZIP_PATH,
    data.allSpecialFilesExt
  )
  for (let i = 0; i < t.ctx.fileNameListNoViewer.length; i++) {
    console.group(
      `\n↳ ℹ️  Viewer : checking no Viewer : other Download features for 📁 ${
        t.ctx.fileNameListNoViewer[i]
      }`
    )
    await viewerPage.openViewerForFile(t.ctx.fileNameListNoViewer[i])
    await viewerPage.checkNoViewer()
    await viewerPage.checkNoViewerDownload()

    await viewerPage.closeViewer({
      exitWithEsc: true
    })
    console.groupEnd()
  }
}).after(async t => {
  for (let i = 0; i < t.ctx.fileNameListNoViewer.length; i++) {
    logger.info(
      `↳ ℹ️  Viewer (No-Viewer) - Checking downloaded files for ${
        t.ctx.fileNameListNoViewer[i]
      }`
    )
    await checkLocalFile(
      `${data.DOWNLOAD_PATH}/${t.ctx.fileNameListNoViewer[i]}`
    )
    await deleteLocalFile(
      `${data.DOWNLOAD_PATH}/${t.ctx.fileNameListNoViewer[i]}`
    )
  }
})

//************************
//Tests when authentified - goes to folder in beforeEach
//************************
fixture`Drive : Viewer features`.page`${TESTCAFE_DRIVE_URL}/`.beforeEach(
  async t => {
    console.group(`\n↳ ℹ️  Login, Page Initialization`)
    await t.useRole(driveUser)
    await drivePage.waitForLoading()
    await drivePage.goToFolder(data.FOLDER_DATE_TIME)
    console.groupEnd()
  }
)

test('Viewer : Image Viewer', async () => {
  const fileNameListImage = await getFilesWithExt(
    data.FILE_FROM_ZIP_PATH,
    data.imageFilesExt
  )
  for (let i = 0; i < fileNameListImage.length; i++) {
    console.group(
      `\n↳ ℹ️  Viewer : checking text features for 📁 ${fileNameListImage[i]}`
    )
    await viewerPage.openViewerForFile(fileNameListImage[i])
    await viewerPage.checkImageViewer()
    await viewerPage.closeViewer({
      exitWithEsc: false
    })
    console.groupEnd()
  }
})

test('Viewer : PDF Viewer : Download', async () => {
  const fileNameListPdf = await getFilesWithExt(
    data.FILE_FROM_ZIP_PATH,
    data.pdfFilesExt
  )
  for (let i = 0; i < fileNameListPdf.length; i++) {
    console.group(
      `\n↳ ℹ️  Viewer : checking Pdf Viewer : Download features for 📁 ${
        fileNameListPdf[i]
      }`
    )
    await viewerPage.openViewerForFile(fileNameListPdf[i])
    await viewerPage.checkPdfViewer()
    await viewerPage.closeViewer({
      exitWithEsc: true
    })
    console.groupEnd()
  }
})

test('Viewer : audio Viewer', async () => {
  const fileNameListAudio = await getFilesWithExt(
    data.FILE_FROM_ZIP_PATH,
    data.audioFilesExt
  )
  for (let i = 0; i < fileNameListAudio.length; i++) {
    console.group(
      `\n↳ ℹ️  Viewer : checking Audio features for 📁 ${fileNameListAudio[i]}`
    )
    await viewerPage.openViewerForFile(fileNameListAudio[i])
    await viewerPage.checkAudioViewer()
    await viewerPage.closeViewer({
      exitWithEsc: false
    })
    console.groupEnd()
  }
})

test('Viewer : video Viewer', async () => {
  const fileNameListVideo = await getFilesWithExt(
    data.FILE_FROM_ZIP_PATH,
    data.videoFilesExt
  )
  for (let i = 0; i < fileNameListVideo.length; i++) {
    console.group(
      `\n↳ ℹ️  Viewer : checking video features for 📁 ${fileNameListVideo[i]}`
    )
    await viewerPage.openViewerForFile(fileNameListVideo[i])
    await viewerPage.checkVideoViewer()
    await viewerPage.closeViewer({
      exitWithEsc: false
    })
    console.groupEnd()
  }
})

test('Viewer : text Viewer', async () => {
  const fileNameListText = await getFilesWithExt(
    data.FILE_FROM_ZIP_PATH,
    data.textFilesExt
  )
  for (let i = 0; i < fileNameListText.length; i++) {
    console.group(
      `\n↳ ℹ️  Viewer : checking text features for 📁 ${fileNameListText[i]}`
    )
    await viewerPage.openViewerForFile(fileNameListText[i])
    await viewerPage.checkTextViewer()
    await viewerPage.closeViewer({
      exitWithEsc: true
    })
    console.groupEnd()
  }
})

//************************
//Tests when authentified - Clean up
//************************
fixture`Test clean up : remove files and folders`
  .page`${TESTCAFE_DRIVE_URL}/`.beforeEach(async t => {
  console.group(`\n↳ ℹ️  Login & Initialization`)
  await t.useRole(driveUser)
  await drivePage.waitForLoading()
  console.groupEnd()
})

test('Delete foler', async () => {
  console.group('↳ ℹ️  Drive : Delete and foler')
  await drivePage.goToFolder(data.FOLDER_DATE_TIME)
  await drivePage.deleteCurrentFolder({})
  console.groupEnd()
})
