import { driveUser } from '../helpers/roles'
import logger from '../helpers/logger'
//import { Role } from 'testcafe'
import {
  TESTCAFE_DRIVE_URL,
  SLUG,
  setDownloadPath,
  checkLocalFile,
  deleteLocalFile
} from '../helpers/utils'
import { initVR } from '../helpers/visualreview-utils'
let data = require('../helpers/data')
import PrivateDriveVRPage from '../pages/drive/drive-model-private'
import PublicDrivePage from '../pages/drive/drive-model-public'
import PublicViewerPage from '../pages/drive-viewer/drive-viewer-model-public'
import * as selectors from '../pages/selectors'

const privateDrivePage = new PrivateDriveVRPage()
const publicDrivePage = new PublicDrivePage()
const publicViewerPage = new PublicViewerPage()

//Scenario const
const FEATURE_PREFIX = 'PublicViewerFeature'

const FIXTURE_INIT = `${FEATURE_PREFIX} 1- Prepare Data`
const TEST_UPLOAD_AND_SHARE = `1-1 Share Folder`

const FIXTURE_PUBLIC_WITH_DL = `${FEATURE_PREFIX} 2- Go to public link and download files`
const TEST_PUBLIC_VIEWER_ZIP = `2-1 Check viewer for zip file`
const TEST_PUBLIC_VIEWER_PPTX = `2-2 Check viewer for pptx file - alternate download`
const TEST_PUBLIC_VIEWER_IMG = '2-3 Check viewer for img file'
const TEST_PUBLIC_VIEWER_AUDIO = '2-4 Check viewer for audio file'
const TEST_PUBLIC_VIEWER_VIDEO = '2-5 Check viewer for video file'
const TEST_PUBLIC_VIEWER_TXT = '2-6 Check viewer for text/md file'

//************************
//Tests when authentified
//************************
fixture`${FIXTURE_INIT}`.page`${TESTCAFE_DRIVE_URL}/`
  .before(async ctx => {
    await initVR(ctx, SLUG, FIXTURE_INIT)
  })
  .beforeEach(async t => {
    console.group(`\n↳ ℹ️  Login & Initialization`)
    await t.maximizeWindow() //Back to desktop

    await t.useRole(driveUser)
    await privateDrivePage.waitForLoading()
    console.groupEnd()
  })
  .after(async ctx => {
    await ctx.vr.checkRunStatus()
  })

test(TEST_UPLOAD_AND_SHARE, async t => {
  console.group(
    `↳ ℹ️  ${FEATURE_PREFIX} : ${TEST_UPLOAD_AND_SHARE} (in "${
      data.FOLDER_NAME
    }" folder)`
  )
  await privateDrivePage.goToFolder(data.FOLDER_NAME)
  await privateDrivePage.shareFolderPublicLink()

  await t.fixtureCtx.vr.takeScreenshotAndUpload({
    screenshotPath: `${FEATURE_PREFIX}/${TEST_UPLOAD_AND_SHARE}-3`,
    withMask: data.maskShareFolder
  })

  const link = await selectors.btnCopyShareByLink.getAttribute('data-test-url')
  if (link) {
    data.sharingLink = link
    logger.debug(`data.sharingLink : ` + data.sharingLink)
  }
  console.groupEnd()
})

//************************
// Public (no authentification) - with Download
//************************
fixture`${FIXTURE_PUBLIC_WITH_DL}`.page`${TESTCAFE_DRIVE_URL}/`
  .before(async ctx => {
    await initVR(ctx, SLUG, FIXTURE_PUBLIC_WITH_DL)
  })
  .beforeEach(async t => {
    console.group(
      `\n↳ ℹ️  no Login (anonymous), DOWNLOAD_PATH initialization and Navigate to link`
    )
    //await t.useRole(Role.anonymous())
    await t.maximizeWindow() //Back to desktop

    await t.navigateTo(data.sharingLink)
    await publicDrivePage.waitForLoading({ isFull: true })

    await setDownloadPath(data.DOWNLOAD_PATH)
    //Init count for navigation
    t.ctx.totalFilesCount = await publicDrivePage.getContentRowCount(
      `${FIXTURE_PUBLIC_WITH_DL} Before`
    )
    console.groupEnd()
  })
  .afterEach(async t => {
    logger.info(
      `↳ ℹ️  ${FEATURE_PREFIX} - Checking downloaded file for ${
        t.ctx.fileDownloaded
      }`
    )
    await checkLocalFile(`${data.DOWNLOAD_PATH}/${t.ctx.fileDownloaded}`)
    await deleteLocalFile(`${data.DOWNLOAD_PATH}/${t.ctx.fileDownloaded}`)
  })
  .after(async ctx => {
    await ctx.vr.checkRunStatus()
  })

test(TEST_PUBLIC_VIEWER_ZIP, async t => {
  console.group(`↳ ℹ️  ${FEATURE_PREFIX} : ${TEST_PUBLIC_VIEWER_ZIP}`)
  //take a general screen for the shared folder :
  await t.fixtureCtx.vr.takeScreenshotAndUpload({
    screenshotPath: `${FEATURE_PREFIX}/${TEST_PUBLIC_VIEWER_ZIP}-wholeFolder`,
    withMask: data.maskSharedWholePublicFolder
  })

  await publicViewerPage.checkViewerNavigation({
    screenshotPath: `${FEATURE_PREFIX}/${TEST_PUBLIC_VIEWER_ZIP}-nav`,
    fileStartName: data.FILE_ZIP,
    numberOfNavigation: 3
  })

  await publicViewerPage.openFileAndCheckCommonViewerDownload(data.FILE_ZIP)
  t.ctx.fileDownloaded = data.FILE_ZIP

  await publicViewerPage.openFileAndCheckPublicViewer({
    screenshotPath: `${FEATURE_PREFIX}/${TEST_PUBLIC_VIEWER_ZIP}-1`,
    fileName: data.FILE_ZIP
  })
  await publicViewerPage.openFileAndCheckMobilePublicViewer({
    screenshotPath: `${FEATURE_PREFIX}/${TEST_PUBLIC_VIEWER_ZIP}-mob1`,
    fileName: data.FILE_ZIP
  })
  console.groupEnd()
})

test(TEST_PUBLIC_VIEWER_ZIP, async t => {
  console.group(`↳ ℹ️  ${FEATURE_PREFIX} : ${TEST_PUBLIC_VIEWER_PPTX}`)
  await publicViewerPage.openViewerForFile(data.FILE_PPTX)
  await publicViewerPage.checkNoViewerDownload(data.FILE_PPTX)
  await publicViewerPage.closeViewer({
    exitWithEsc: false
  })
  t.ctx.fileDownloaded = data.FILE_PPTX

  await publicViewerPage.openFileAndCheckPublicViewer({
    screenshotPath: `${FEATURE_PREFIX}/${TEST_PUBLIC_VIEWER_PPTX}-1`,
    fileName: data.FILE_PPTX
  })
  await publicViewerPage.openFileAndCheckMobilePublicViewer({
    screenshotPath: `${FEATURE_PREFIX}/${TEST_PUBLIC_VIEWER_PPTX}-mob1`,
    fileName: data.FILE_PPTX
  })
  console.groupEnd()
})

test(TEST_PUBLIC_VIEWER_IMG, async t => {
  console.group(`↳ ℹ️  ${FEATURE_PREFIX} : ${TEST_PUBLIC_VIEWER_IMG}`)
  await publicViewerPage.openFileAndCheckCommonViewerDownload(data.FILE_IMG)
  t.ctx.fileDownloaded = data.FILE_IMG

  await publicViewerPage.openFileAndCheckPublicViewer({
    screenshotPath: `${FEATURE_PREFIX}/${TEST_PUBLIC_VIEWER_IMG}-1`,
    fileName: data.FILE_IMG,
    type: 'img'
  })
  await publicViewerPage.openFileAndCheckMobilePublicViewer({
    screenshotPath: `${FEATURE_PREFIX}/${TEST_PUBLIC_VIEWER_IMG}-mob1`,
    fileName: data.FILE_IMG
  })
  console.groupEnd()
})

test(TEST_PUBLIC_VIEWER_AUDIO, async t => {
  console.group(`↳ ℹ️  ${FEATURE_PREFIX} : ${TEST_PUBLIC_VIEWER_AUDIO}`)
  await publicViewerPage.openFileAndCheckCommonViewerDownload(data.FILE_AUDIO)
  t.ctx.fileDownloaded = data.FILE_AUDIO

  //mask on loading bar
  await publicViewerPage.openFileAndCheckPublicViewer({
    screenshotPath: `${FEATURE_PREFIX}/${TEST_PUBLIC_VIEWER_AUDIO}-1`,
    fileName: data.FILE_AUDIO,
    type: 'audio',
    withMask: data.maskAudioViewerDesktop
  })
  //mask on loading bar for mobile
  await publicViewerPage.openFileAndCheckMobilePublicViewer({
    screenshotPath: `${FEATURE_PREFIX}/${TEST_PUBLIC_VIEWER_AUDIO}-mob1`,
    fileName: data.FILE_AUDIO,
    type: 'audio',
    withMask: data.maskAudioViewerMobile
  })
  console.groupEnd()
})

test(TEST_PUBLIC_VIEWER_VIDEO, async t => {
  console.group(`↳ ℹ️  ${FEATURE_PREFIX} : ${TEST_PUBLIC_VIEWER_VIDEO}`)
  await publicViewerPage.openFileAndCheckCommonViewerDownload(data.FILE_VIDEO)
  t.ctx.fileDownloaded = data.FILE_VIDEO

  await publicViewerPage.openFileAndCheckPublicViewer({
    screenshotPath: `${FEATURE_PREFIX}/${TEST_PUBLIC_VIEWER_VIDEO}-1`,
    fileName: data.FILE_VIDEO,
    type: 'video',
    withMask: data.maskVideoViewerDesktop
  })

  await publicViewerPage.openFileAndCheckMobilePublicViewer({
    screenshotPath: `${FEATURE_PREFIX}/${TEST_PUBLIC_VIEWER_VIDEO}-mob1`,
    fileName: data.FILE_VIDEO,
    type: 'video',
    withMask: data.maskVideoViewerMobile
  })

  console.groupEnd()
})

test(TEST_PUBLIC_VIEWER_TXT, async t => {
  console.group(`↳ ℹ️  ${FEATURE_PREFIX} : ${TEST_PUBLIC_VIEWER_TXT}`)
  await publicViewerPage.openFileAndCheckCommonViewerDownload(data.FILE_TXT)
  t.ctx.fileDownloaded = data.FILE_TXT

  await publicViewerPage.openFileAndCheckPublicViewer({
    screenshotPath: `${FEATURE_PREFIX}/${TEST_PUBLIC_VIEWER_TXT}-1`,
    fileName: data.FILE_TXT,
    type: 'txt'
  })
  await publicViewerPage.openFileAndCheckMobilePublicViewerBiggerResolution({
    screenshotPath: `${FEATURE_PREFIX}/${TEST_PUBLIC_VIEWER_TXT}-mob1`,
    fileName: data.FILE_TXT
  })
  console.groupEnd()
})
