import { driveUser } from '../helpers/roles'
import logger from '../helpers/logger'
import {
  TESTCAFE_DRIVE_URL,
  setDownloadPath,
  checkLocalFile,
  deleteLocalFile
} from '../helpers/utils'
let data = require('../helpers/data')
import PrivateDriveVRPage from '../pages/drive/drive-model-private'
import PrivateViewerPage from '../pages/drive-viewer/drive-viewer-model'

const privateDrivePage = new PrivateDriveVRPage()
const viewerPage = new PrivateViewerPage()

//Scenario const
const FEATURE_PREFIX = 'PrivateViewerFeature'

const FIXTURE_PRIVATE_WITH_DL = `${FEATURE_PREFIX} 3- PRIVATE Viewer - Go to folder and download files`
const TEST_PRIVATE_VIEWER_ZIP = `3-1 Check viewer for zip file`
const TEST_PPRIVATE_VIEWER_PPTX = `3-2 Check viewer for pptx file - alternate download`
const TEST_PRIVATE_VIEWER_IMG = '3-3 Check viewer for img file'
const TEST_PRIVATE_VIEWER_AUDIO = '3-4 Check viewer for audio file'
const TEST_PRIVATE_VIEWER_VIDEO = '3-5 Check viewer for video file'
const TEST_PRIVATE_VIEWER_TXT = '3-6 Check viewer for text/md file'
const TEST_PRIVATE_VIEWER_PDF = `3-7 Check viewer for pdf file`

//************************
//Tests when authentified - with Download
//************************
fixture`${FIXTURE_PRIVATE_WITH_DL}`.page`${TESTCAFE_DRIVE_URL}/`
  .beforeEach(async t => {
    console.group(
      `\n↳ ℹ️  no Login (anonymous), DOWNLOAD_PATH initialization and Navigate to link`
    )
    await t.maximizeWindow()

    await t.useRole(driveUser)
    await privateDrivePage.waitForLoading()
    await privateDrivePage.goToFolder(data.FOLDER_NAME)
    await setDownloadPath(data.DOWNLOAD_PATH)
    console.groupEnd()
  })
  .afterEach(async t => {
    logger.info(
      `↳ ℹ️  ${FEATURE_PREFIX} - Checking downloaded file for ${
        t.ctx.fileDownloaded
      }`
    )
    await checkLocalFile(t, `${data.DOWNLOAD_PATH}/${t.ctx.fileDownloaded}`)
    await deleteLocalFile(`${data.DOWNLOAD_PATH}/${t.ctx.fileDownloaded}`)
  })

test(TEST_PRIVATE_VIEWER_ZIP, async t => {
  console.group(`↳ ℹ️  ${FEATURE_PREFIX} : ${TEST_PRIVATE_VIEWER_ZIP}`)
  //Common for all viewer
  await viewerPage.openFileAndCheckCommonViewerDownload(data.FILE_ZIP)
  t.ctx.fileDownloaded = data.FILE_ZIP

  //Specific viewer
  await viewerPage.openViewerForFile(data.FILE_ZIP)
  await viewerPage.checkNoViewer()
  await viewerPage.closeViewer({
    exitWithEsc: true
  })
  console.groupEnd()
})

test(TEST_PPRIVATE_VIEWER_PPTX, async t => {
  console.group(`↳ ℹ️  ${FEATURE_PREFIX} : ${TEST_PPRIVATE_VIEWER_PPTX}`)
  //Specific viewer
  await viewerPage.openViewerForFile(data.FILE_PPTX)
  await viewerPage.checkNoViewer()
  await viewerPage.checkNoViewerDownload()
  t.ctx.fileDownloaded = data.FILE_PPTX
  await viewerPage.closeViewer({
    exitWithEsc: true
  })
  console.groupEnd()
})

test(TEST_PRIVATE_VIEWER_IMG, async t => {
  //Common for all viewer
  await viewerPage.openFileAndCheckCommonViewerDownload(data.FILE_IMG)
  t.ctx.fileDownloaded = data.FILE_IMG

  //Specific viewer
  await viewerPage.openViewerForFile(data.FILE_IMG)
  await viewerPage.checkImageViewer()
  await viewerPage.closeViewer({
    exitWithEsc: true
  })
  console.groupEnd()
})

test(TEST_PRIVATE_VIEWER_AUDIO, async t => {
  //Common for all viewer
  await viewerPage.openFileAndCheckCommonViewerDownload(data.FILE_AUDIO)
  t.ctx.fileDownloaded = data.FILE_AUDIO

  //Specific viewer
  await viewerPage.openViewerForFile(data.FILE_AUDIO)
  await viewerPage.checkAudioViewer()
  await viewerPage.closeViewer({
    exitWithEsc: false
  })
  console.groupEnd()
})

test(TEST_PRIVATE_VIEWER_VIDEO, async t => {
  console.group(`↳ ℹ️  ${FEATURE_PREFIX} : ${TEST_PRIVATE_VIEWER_VIDEO}`)
  //Common for all viewer
  await viewerPage.openFileAndCheckCommonViewerDownload(data.FILE_VIDEO)
  t.ctx.fileDownloaded = data.FILE_VIDEO

  //Specific viewer
  await viewerPage.openViewerForFile(data.FILE_VIDEO)
  await viewerPage.checkVideoViewer()
  await viewerPage.closeViewer({
    exitWithEsc: true
  })
  console.groupEnd()
})

test(TEST_PRIVATE_VIEWER_TXT, async t => {
  console.group(`↳ ℹ️  ${FEATURE_PREFIX} : ${TEST_PRIVATE_VIEWER_TXT}`)
  //Common for all viewer
  await viewerPage.openFileAndCheckCommonViewerDownload(data.FILE_TXT)
  t.ctx.fileDownloaded = data.FILE_TXT

  //Specific viewer
  await viewerPage.openViewerForFile(data.FILE_TXT)
  await viewerPage.checkTextViewer()
  await viewerPage.closeViewer({
    exitWithEsc: false
  })
  console.groupEnd()
})

test(TEST_PRIVATE_VIEWER_PDF, async t => {
  console.group(`↳ ℹ️  ${FEATURE_PREFIX} : ${TEST_PRIVATE_VIEWER_PDF}`)
  //Common for all viewer
  await viewerPage.openFileAndCheckCommonViewerDownload(data.FILE_PDF)
  t.ctx.fileDownloaded = data.FILE_PDF

  //Specific viewer
  await viewerPage.openViewerForFile(data.FILE_PDF)
  await viewerPage.checkPdfViewer()
  await viewerPage.closeViewer({
    exitWithEsc: true
  })
  console.groupEnd()
})
