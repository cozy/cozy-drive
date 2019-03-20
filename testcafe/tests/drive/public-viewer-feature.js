import { driveUser } from '../helpers/roles'
import { Role } from 'testcafe'
import {
  TESTCAFE_DRIVE_URL,
  SLUG,
  setDownloadPath,
  checkLocalFile,
  deleteLocalFile
} from '../helpers/utils'
import { initVR } from '../helpers/visualreview-utils'
let data = require('../helpers/data')
import DriveVRPage from '../pages/drive-model'
import PublicDrivePage from '../pages/drive-model-public'
import PublicViewerPage from '../pages/drive-viewer-model-public'

const drivePage = new DriveVRPage()
const publicDrivePage = new PublicDrivePage()
const publicViewerPage = new PublicViewerPage()

//Scenario const
const FEATURE_PREFIX = 'PublicViewerFeature'

const FIXTURE_INIT = `${FEATURE_PREFIX} 1- Prepare Data`
const TEST_CREATE_FOLDER = `1-1 Create Folder`
const TEST_UPLOAD_AND_SHARE = `1-2 Upload Files and Share Folder`

const FIXTURE_PUBLIC_WITH_DL = `${FEATURE_PREFIX} 2- Go to public link and download files`
const TEST_PUBLIC_VIEWER_ZIP = `2-1 Check viewer for zip file`
const TEST_PUBLIC_VIEWER_PPTX = `2-2 Check viewer for pptx file - alternate download`
const TEST_PUBLIC_VIEWER_IMG = '2-3 Check viewer for img file'
const TEST_PUBLIC_VIEWER_AUDIO = '2-4 Check viewer for audio file'
const TEST_PUBLIC_VIEWER_VIDEO = '2-5 Check viewer for video file'
const TEST_PUBLIC_VIEWER_TXT = '2-6 Check viewer for text/md file'

const FIXTURE_CLEANUP = `${FEATURE_PREFIX} 3- Cleanup Data`
const TEST_DELETE_FOLDER = `3-1 Delete Folder`
//************************
//Tests when authentified
//************************
fixture`${FIXTURE_INIT}`.page`${TESTCAFE_DRIVE_URL}/`
  .before(async ctx => {
    await initVR(ctx, SLUG, FIXTURE_INIT)
    console.log(`ctx.isVR ${ctx.isVR}`)
  })
  .beforeEach(async t => {
    console.group(`\n↳ ℹ️  Loggin & Initialization`)
    await t.useRole(driveUser)
    await drivePage.waitForLoading()
    console.groupEnd()
  })
  .after(async ctx => {
    await ctx.vr.checkRunStatus()
  })

test(`${TEST_CREATE_FOLDER}`, async t => {
  await t.maximizeWindow() //Real fullscren for VR
  console.group(`↳ ℹ️  ${FEATURE_PREFIX} : ${TEST_CREATE_FOLDER}`)
  await drivePage.addNewFolder(
    `${FEATURE_PREFIX} - ${TEST_CREATE_FOLDER}`,
    `${FEATURE_PREFIX}/${TEST_CREATE_FOLDER}-1`
  )
  await t.fixtureCtx.vr.takeScreenshotAndUpload(
    `${FEATURE_PREFIX}/${TEST_CREATE_FOLDER}-2`
  )
  console.groupEnd()
})

test(`${TEST_UPLOAD_AND_SHARE}`, async t => {
  console.group(
    `↳ ℹ️  ${FEATURE_PREFIX} : ${TEST_UPLOAD_AND_SHARE} (in "${FEATURE_PREFIX} - ${TEST_CREATE_FOLDER}" folder)`
  )
  await drivePage.goToFolder(TEST_CREATE_FOLDER)
  await t.fixtureCtx.vr.takeScreenshotAndUpload(
    `${FEATURE_PREFIX}/${TEST_UPLOAD_AND_SHARE}-1`
  )
  await drivePage.uploadFiles(data.filesList)
  await t.fixtureCtx.vr.takeScreenshotWithMaskAndUpload(
    `${FEATURE_PREFIX}/${TEST_UPLOAD_AND_SHARE}-2`,
    {
      height: 935,
      x: 916,
      width: 140,
      y: 248
    }
  )
  await drivePage.shareFolderPublicLink()

  await t.fixtureCtx.vr.takeScreenshotAndUpload(
    `${FEATURE_PREFIX}/${TEST_UPLOAD_AND_SHARE}-3`,
    {
      height: 918,
      x: 916,
      width: 140,
      y: 520
    }
  )

  const link = await drivePage.copyBtnShareByLink.getAttribute('data-test-url')
  if (link) {
    data.sharingLink = link
    console.log(`data.sharingLink : ` + data.sharingLink)
  }
  console.groupEnd()
})

//************************
// Public (no authentification) - with Download
//************************
fixture.skip`${FIXTURE_PUBLIC_WITH_DL}`.page`${TESTCAFE_DRIVE_URL}/`
  .before(async ctx => {
    await initVR(ctx, SLUG, FIXTURE_PUBLIC_WITH_DL)
  })
  .beforeEach(async t => {
    console.group(
      `\n↳ ℹ️  no Loggin (anonymous), DOWNLOAD_PATH initialization and Navigate to link`
    )
    await t.useRole(Role.anonymous())
    await t.navigateTo(data.sharingLink)
    await publicDrivePage.waitForLoading()

    await setDownloadPath(data.DOWNLOAD_PATH)
    //Init count for navigation
    t.ctx.totalFilesCount = await publicDrivePage.getContentRowCount(
      `${FIXTURE_PUBLIC_WITH_DL} Before`
    )
    console.groupEnd()
  })
  .afterEach(async t => {
    console.log(
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

test(`${TEST_PUBLIC_VIEWER_ZIP}`, async t => {
  console.group(`↳ ℹ️  ${FEATURE_PREFIX} : ${TEST_PUBLIC_VIEWER_ZIP}`)
  //take a general screen for the shared folder :
  await t.fixtureCtx.vr.takeScreenshotWithMaskAndUpload(
    `${FEATURE_PREFIX}/${TEST_PUBLIC_VIEWER_ZIP}-wholeFolder`,
    {
      height: 935,
      x: 916,
      width: 140,
      y: 248
    }
  )
  await publicViewerPage.checkViewerNavigation_vr(
    `${FEATURE_PREFIX}/${TEST_PUBLIC_VIEWER_ZIP}-nav`,
    data.FILE_ZIP,
    3
  )

  await publicViewerPage.checkCommonViewerDownload(data.FILE_ZIP)
  t.ctx.fileDownloaded = data.FILE_ZIP

  await publicViewerPage.checkPublicViewer_vr(
    `${FEATURE_PREFIX}/${TEST_PUBLIC_VIEWER_ZIP}-1`,
    data.FILE_ZIP
  )
  await publicViewerPage.checkMobilePublicViewer_vr(
    `${FEATURE_PREFIX}/${TEST_PUBLIC_VIEWER_ZIP}-mob1`,
    data.FILE_ZIP
  )
  console.groupEnd()
})

test(`${TEST_PUBLIC_VIEWER_ZIP}`, async t => {
  console.group(`↳ ℹ️  ${FEATURE_PREFIX} : ${TEST_PUBLIC_VIEWER_PPTX}`)
  await publicViewerPage.checkNoViewerDownload(data.FILE_PPTX)
  t.ctx.fileDownloaded = data.FILE_PPTX

  await publicViewerPage.checkPublicViewer_vr(
    `${FEATURE_PREFIX}/${TEST_PUBLIC_VIEWER_PPTX}-1`,
    data.FILE_PPTX
  )
  await publicViewerPage.checkMobilePublicViewer_vr(
    `${FEATURE_PREFIX}/${TEST_PUBLIC_VIEWER_PPTX}-mob1`,
    data.FILE_PPTX
  )
  console.groupEnd()
})

test(`${TEST_PUBLIC_VIEWER_IMG}`, async t => {
  console.group(`↳ ℹ️  ${FEATURE_PREFIX} : ${TEST_PUBLIC_VIEWER_IMG}`)
  await publicViewerPage.checkCommonViewerDownload(data.FILE_IMG)
  t.ctx.fileDownloaded = data.FILE_IMG

  await publicViewerPage.checkPublicViewer_vr(
    `${FEATURE_PREFIX}/${TEST_PUBLIC_VIEWER_IMG}-1`,
    data.FILE_IMG,
    'img'
  )
  await publicViewerPage.checkMobilePublicViewer_vr(
    `${FEATURE_PREFIX}/${TEST_PUBLIC_VIEWER_IMG}-mob1`,
    data.FILE_IMG
  )
  console.groupEnd()
})

test(`${TEST_PUBLIC_VIEWER_AUDIO}`, async t => {
  console.group(`↳ ℹ️  ${FEATURE_PREFIX} : ${TEST_PUBLIC_VIEWER_AUDIO}`)
  await publicViewerPage.checkCommonViewerDownload(data.FILE_AUDIO)
  t.ctx.fileDownloaded = data.FILE_AUDIO

  await publicViewerPage.checkPublicViewer_vr(
    `${FEATURE_PREFIX}/${TEST_PUBLIC_VIEWER_AUDIO}-1`,
    data.FILE_AUDIO,
    'audio'
  )
  await publicViewerPage.checkMobilePublicViewer_vr(
    `${FEATURE_PREFIX}/${TEST_PUBLIC_VIEWER_AUDIO}-mob1`,
    data.FILE_AUDIO
  )
  console.groupEnd()
})

test(`${TEST_PUBLIC_VIEWER_VIDEO}`, async t => {
  console.group(`↳ ℹ️  ${FEATURE_PREFIX} : ${TEST_PUBLIC_VIEWER_VIDEO}`)
  await publicViewerPage.checkCommonViewerDownload(data.FILE_VIDEO)
  t.ctx.fileDownloaded = data.FILE_VIDEO

  await publicViewerPage.checkPublicViewer_vr(
    `${FEATURE_PREFIX}/${TEST_PUBLIC_VIEWER_VIDEO}-1`,
    data.FILE_VIDEO,
    'video'
  )
  await publicViewerPage.checkMobilePublicViewer_vr(
    `${FEATURE_PREFIX}/${TEST_PUBLIC_VIEWER_VIDEO}-mob1`,
    data.FILE_VIDEO
  )
  console.groupEnd()
})

test(`${TEST_PUBLIC_VIEWER_TXT}`, async t => {
  console.group(`↳ ℹ️  ${FEATURE_PREFIX} : ${TEST_PUBLIC_VIEWER_TXT}`)
  await publicViewerPage.checkCommonViewerDownload(data.FILE_TXT)
  t.ctx.fileDownloaded = data.FILE_TXT

  await publicViewerPage.checkPublicViewer_vr(
    `${FEATURE_PREFIX}/${TEST_PUBLIC_VIEWER_TXT}-1`,
    data.FILE_TXT,
    'txt'
  )
  await publicViewerPage.checkMobilePublicViewer_vr(
    `${FEATURE_PREFIX}/${TEST_PUBLIC_VIEWER_TXT}-mob1`,
    data.FILE_TXT
  )
  console.groupEnd()
})

//************************
//Tests when authentified - Clean up
//************************
fixture`${FIXTURE_CLEANUP}`.page`${TESTCAFE_DRIVE_URL}/`
  .before(async ctx => {
    await initVR(ctx, SLUG, FIXTURE_CLEANUP)
  })
  .beforeEach(async t => {
    console.group(`\n↳ ℹ️  Loggin & Initialization`)
    await t.useRole(driveUser)
    await drivePage.waitForLoading()
    console.groupEnd()
  })
  .after(async ctx => {
    await ctx.vr.checkRunStatus()
  })

test(`${TEST_DELETE_FOLDER}`, async t => {
  console.group(`↳ ℹ️  ${FEATURE_PREFIX} : ${TEST_DELETE_FOLDER}`)
  await drivePage.goToFolder(TEST_CREATE_FOLDER)
  await t.fixtureCtx.vr.takeScreenshotWithMaskAndUpload(
    `${FEATURE_PREFIX}/${TEST_DELETE_FOLDER}-1`,
    {
      height: 935,
      x: 916,
      width: 140,
      y: 248
    }
  )
  await t.fixtureCtx.vr.takeScreenshotWithMaskAndUpload(
    `${FEATURE_PREFIX}/${TEST_DELETE_FOLDER}-2`,
    {
      height: 918,
      x: 916,
      width: 140,
      y: 520
    }
  )
  await t.fixtureCtx.vr.takeScreenshotAndUpload(
    `${FEATURE_PREFIX}/${TEST_DELETE_FOLDER}-3`
  )
  console.groupEnd()
})
