import { driveUser } from '../helpers/roles'
import logger from '../helpers/logger'
import {
  TESTCAFE_DRIVE_URL,
  SLUG,
  isExistingAndVisibile
} from '../helpers/utils'
import { initVR } from '../helpers/visualreview-utils'
import {
  THUMBNAIL_DELAY,
  FILE_FROM_ZIP_PATH,
  FILE_PDF,
  FILE_TXT,
  maskDriveFolderWithDate,
  maskDeleteFolder,
  maskMoveMoadal
} from '../helpers/data'
import { checkToastAppearsAndDisappears } from '../pages/commons'
import * as selectors from '../pages/selectors'
import PrivateDrivePage from '../pages/drive/drive-model-private'

const privateDrivePage = new PrivateDrivePage()

//Scenario const
const FEATURE_PREFIX = 'ClassicationScenario'

const FIXTURE_INIT = `${FEATURE_PREFIX} 1- Prepare Data`
const TEST_CREATE_FOLDER = `1-1 Create Folders`
const TEST_UPLOAD = `1-2 Upload file`

const FIXTURE_CLASSIFICATION = `${FEATURE_PREFIX} 2- Classification actions on file`
const TEST_RENAME_FILE = `2-1 Rename file`
const TEST_MOVE_FILE_CANCEL = `2-2 Move Modal and Cancel`
const TEST_MOVE_FILE = `2-3 Move file`
const TEST_MOVE_FOLDER = `2-4 Move folder`

const FIXTURE_TRASH = `${FEATURE_PREFIX} 3- Trash and Restore`
const TEST_DELETE_FOLDER = `3-1 Delete Folder`
const TEST_RESTORE_FOLDER = `3-2 Restore Folder`
const TEST_DELETE_FOLDER_FROM_DRIVE = `3-3 Delete Folder from Drive`
const TEST_NAVIGATE_IN_TRASH = `3-4 Navigate in Trash`
const TEST_EMPTY_TRASH = `3-5 Empty Trash`

//************************
//Tests when authentified
//************************
fixture`${FIXTURE_INIT}`.page`${TESTCAFE_DRIVE_URL}/`
  .before(async ctx => {
    await initVR(ctx, SLUG, FIXTURE_INIT)
  })
  .beforeEach(async t => {
    console.group(`\n↳ ℹ️  Login & Initialization`)
    await t.maximizeWindow()

    await t.useRole(driveUser)
    await privateDrivePage.waitForLoading()
    console.groupEnd()
  })
  .after(async ctx => {
    await ctx.vr.checkRunStatus()
  })

test(TEST_CREATE_FOLDER, async t => {
  await t.maximizeWindow() //Real fullscren for VR
  console.group(`↳ ℹ️  ${FEATURE_PREFIX} : ${TEST_CREATE_FOLDER}`)

  await privateDrivePage.addNewFolder({
    newFolderName: `${FEATURE_PREFIX}-Folder1`,
    screenshotPath: `${FEATURE_PREFIX}/${TEST_CREATE_FOLDER}-Folder1-1`
  })
  await t.fixtureCtx.vr.takeScreenshotAndUpload({
    screenshotPath: `${FEATURE_PREFIX}/${TEST_CREATE_FOLDER}-Folder1-2`
  })

  //Create 2nd Folder
  await privateDrivePage.addNewFolder({
    newFolderName: `${FEATURE_PREFIX}-Folder2`,
    screenshotPath: `${FEATURE_PREFIX}/${TEST_CREATE_FOLDER}-Folder2-1`
  })
  await t.fixtureCtx.vr.takeScreenshotAndUpload({
    screenshotPath: `${FEATURE_PREFIX}/${TEST_CREATE_FOLDER}-Folder2-2`
  })
  console.groupEnd()
})

test(TEST_UPLOAD, async t => {
  console.group(
    `↳ ℹ️  ${FEATURE_PREFIX} : ${TEST_UPLOAD} (in "${FEATURE_PREFIX}-Folder2" folder)`
  )
  await privateDrivePage.goToFolder(`${FEATURE_PREFIX}-Folder2`)
  await t.fixtureCtx.vr.takeScreenshotAndUpload({
    screenshotPath: `${FEATURE_PREFIX}/${TEST_UPLOAD}-1`
  })

  await privateDrivePage.uploadFiles([`${FILE_FROM_ZIP_PATH}/${FILE_PDF}`])
  await t.fixtureCtx.vr.takeScreenshotAndUpload({
    screenshotPath: `${FEATURE_PREFIX}/${TEST_UPLOAD}-2-Divupload`,
    selector: selectors.divUpload
  })
  await t.fixtureCtx.vr.takeScreenshotAndUpload({
    screenshotPath: `${FEATURE_PREFIX}/${TEST_UPLOAD}-2`,
    delay: THUMBNAIL_DELAY,
    withMask: maskDriveFolderWithDate,
    pageToWait: privateDrivePage
  })

  await privateDrivePage.uploadFiles([`${FILE_FROM_ZIP_PATH}/${FILE_TXT}`])
  await t.fixtureCtx.vr.takeScreenshotAndUpload({
    screenshotPath: `${FEATURE_PREFIX}/${TEST_UPLOAD}-3-Divupload`,
    selector: selectors.divUpload
  })
  await t.fixtureCtx.vr.takeScreenshotAndUpload({
    screenshotPath: `${FEATURE_PREFIX}/${TEST_UPLOAD}-3`,
    delay: THUMBNAIL_DELAY,
    withMask: maskDriveFolderWithDate,
    pageToWait: privateDrivePage
  })
  console.groupEnd()
})

//************************
//Tests when authentified
//************************
fixture`${FIXTURE_CLASSIFICATION}`.page`${TESTCAFE_DRIVE_URL}/`
  .before(async ctx => {
    await initVR(ctx, SLUG, FIXTURE_CLASSIFICATION)
  })
  .beforeEach(async t => {
    console.group(`\n↳ ℹ️  Login & Initialization`)
    await t.maximizeWindow()

    await t.useRole(driveUser)
    await privateDrivePage.waitForLoading()
    console.groupEnd()
  })
  .after(async ctx => {
    await ctx.vr.checkRunStatus()
  })

test(TEST_RENAME_FILE, async t => {
  console.group(`↳ ℹ️  ${FEATURE_PREFIX} : ${TEST_RENAME_FILE}`)
  const [fileName, ext] = FILE_PDF.split('.')

  await privateDrivePage.goToFolder(`${FEATURE_PREFIX}-Folder2`)
  await privateDrivePage.renameElementByName({
    elementName: FILE_PDF,
    newName: `${fileName}2.${ext}`,
    exitWithEnter: true,
    screenshotPath: `${FEATURE_PREFIX}/${TEST_RENAME_FILE}-1`,
    withMask: maskDriveFolderWithDate
  })
  await t.fixtureCtx.vr.takeScreenshotAndUpload({
    screenshotPath: `${FEATURE_PREFIX}/${TEST_RENAME_FILE}-1-rename2`,
    withMask: maskDriveFolderWithDate
  })

  await privateDrivePage.renameElementByName({
    elementName: `${fileName}2.${ext}`,
    newName: FILE_PDF,
    screenshotPath: `${FEATURE_PREFIX}/${TEST_RENAME_FILE}-2`,
    exitWithEnter: false,
    withMask: maskDriveFolderWithDate
  })

  await t.fixtureCtx.vr.takeScreenshotAndUpload({
    screenshotPath: `${FEATURE_PREFIX}/${TEST_RENAME_FILE}-2-rename2`,
    withMask: maskDriveFolderWithDate
  })

  console.groupEnd()
})

test(TEST_MOVE_FILE_CANCEL, async t => {
  console.group(`↳ ℹ️  ${FEATURE_PREFIX} : ${TEST_MOVE_FILE_CANCEL}`)
  //set mask only once, all screen in this test use the same mask
  await privateDrivePage.goToFolder(`${FEATURE_PREFIX}-Folder2`)

  logger.info('Show Action Menu & Cancel')
  await privateDrivePage.clickOnActionMenuforElementName(FILE_PDF)
  await t.fixtureCtx.vr.takeScreenshotAndUpload({
    screenshotPath: `${FEATURE_PREFIX}/${TEST_MOVE_FILE_CANCEL}-1`,
    withMask: maskDriveFolderWithDate
  })
  await t.pressKey('esc')

  logger.info('Show Move Moadal, and Cancel (X button)')
  await privateDrivePage.showMoveModalForElement(FILE_PDF)
  // move modale show up : we need a specific mask for it
  await t.fixtureCtx.vr.takeScreenshotAndUpload({
    screenshotPath: `${FEATURE_PREFIX}/${TEST_MOVE_FILE_CANCEL}-2`,
    withMask: maskMoveMoadal
  })
  await isExistingAndVisibile(selectors.modalClose, 'selectors.modalClose')
  await t.click(selectors.modalClose)
  await t.fixtureCtx.vr.takeScreenshotAndUpload({
    screenshotPath: `${FEATURE_PREFIX}/${TEST_MOVE_FILE_CANCEL}-3`,
    withMask: maskDriveFolderWithDate
  })
  //Remove comment below when https://trello.com/c/RoNPTPZV/1692-modale-d%C3%A9placement-touch-echap-ne-ferme-pas-la-modale is fixed
  // logger.info('Show Move Moadal, and Cancel (esc)')
  // await privateDrivePage.showMoveModalForElement(FILE_PDF)
  // // no need to screenshot again the modal
  // await t.pressKey('esc')
  //  await t.fixtureCtx.vr.takeScreenshotAndUpload({
  //   screenshotPath: `${FEATURE_PREFIX}/${TEST_MOVE_FILE_CANCEL}-4`,
  //   withMask: maskDriveFolderWithDate
  // })

  logger.info('Show Move Moadal, and Cancel (Cancel button)')
  await privateDrivePage.showMoveModalForElement(FILE_PDF)
  // no need to screenshot again the modal
  await isExistingAndVisibile(
    selectors.btnModalFirstButton,
    'selectors.btnModalFirstButton'
  )
  await t.click(selectors.btnModalFirstButton)
  await t.fixtureCtx.vr.takeScreenshotAndUpload({
    screenshotPath: `${FEATURE_PREFIX}/${TEST_MOVE_FILE_CANCEL}-5`,
    withMask: maskDriveFolderWithDate
  })

  console.groupEnd()
})

test(TEST_MOVE_FILE, async t => {
  console.group(`↳ ℹ️  ${FEATURE_PREFIX} : ${TEST_MOVE_FILE}`)
  await privateDrivePage.goToFolder(`${FEATURE_PREFIX}-Folder2`)

  await privateDrivePage.showMoveModalForElement(FILE_PDF)
  await t.fixtureCtx.vr.takeScreenshotAndUpload({
    screenshotPath: `${FEATURE_PREFIX}/${TEST_MOVE_FILE}-1`,
    withMask: maskMoveMoadal
  })
  await privateDrivePage.moveElementTo(`${FEATURE_PREFIX}-Folder1`)

  await checkToastAppearsAndDisappears('has been moved to')

  await t.fixtureCtx.vr.takeScreenshotAndUpload({
    screenshotPath: `${FEATURE_PREFIX}/${TEST_MOVE_FILE}-2`,
    withMask: maskDriveFolderWithDate
  })
  console.groupEnd()
})

test(TEST_MOVE_FOLDER, async t => {
  console.group(`↳ ℹ️  ${FEATURE_PREFIX} : ${TEST_MOVE_FOLDER}`)

  await privateDrivePage.showMoveModalForElement(`${FEATURE_PREFIX}-Folder2`)
  //No mask here, as screenshot show only folders, not files (So no date on screen)
  await t.fixtureCtx.vr.takeScreenshotAndUpload({
    screenshotPath: `${FEATURE_PREFIX}/${TEST_MOVE_FOLDER}-1`
  })
  await privateDrivePage.moveElementTo(`${FEATURE_PREFIX}-Folder1`)

  await checkToastAppearsAndDisappears('has been moved to')

  await t.fixtureCtx.vr.takeScreenshotAndUpload({
    screenshotPath: `${FEATURE_PREFIX}/${TEST_MOVE_FOLDER}-2`,
    withMask: maskDriveFolderWithDate
  })
  console.groupEnd()
})

//************************
//Tests when authentified - Trash and restore
//************************
fixture`${FIXTURE_TRASH}`.page`${TESTCAFE_DRIVE_URL}/`
  .before(async ctx => {
    await initVR(ctx, SLUG, FIXTURE_TRASH)
  })
  .beforeEach(async t => {
    console.group(`\n↳ ℹ️  Login & Initialization`)
    await t.maximizeWindow()

    await t.useRole(driveUser)
    await privateDrivePage.waitForLoading()
    console.groupEnd()
  })
  .after(async ctx => {
    await ctx.vr.checkRunStatus()
  })

test(TEST_DELETE_FOLDER, async t => {
  console.group(
    `↳ ℹ️  ${FEATURE_PREFIX} : ${TEST_DELETE_FOLDER} "${FEATURE_PREFIX}-Folder1"`
  )
  await privateDrivePage.goToFolder(`${FEATURE_PREFIX}-Folder1`)
  await t.fixtureCtx.vr.takeScreenshotAndUpload({
    screenshotPath: `${FEATURE_PREFIX}/${TEST_DELETE_FOLDER}-1`,
    withMask: maskDriveFolderWithDate
  })

  await privateDrivePage.deleteCurrentFolder({
    screenshotPath: `${FEATURE_PREFIX}/${TEST_DELETE_FOLDER}-2`,
    withMask: maskDeleteFolder
  })

  await checkToastAppearsAndDisappears(
    'The selection has been moved to the Trash.'
  )
  await t.fixtureCtx.vr.takeScreenshotAndUpload({
    screenshotPath: `${FEATURE_PREFIX}/${TEST_DELETE_FOLDER}-3`
  })
  console.groupEnd()
})

test(TEST_RESTORE_FOLDER, async t => {
  console.group(
    `↳ ℹ️  ${FEATURE_PREFIX} : ${TEST_RESTORE_FOLDER} "${FEATURE_PREFIX}-Folder1"`
  )
  await privateDrivePage.clickOnSidebarButton(
    selectors.btnNavToTrash,
    '#/trash',
    'Trash'
  )
  await privateDrivePage.clickOnActionMenuforElementName(
    `${FEATURE_PREFIX}-Folder1`
  )
  await t.fixtureCtx.vr.takeScreenshotAndUpload({
    screenshotPath: `${FEATURE_PREFIX}/${TEST_RESTORE_FOLDER}-1`,
    withMask: maskDriveFolderWithDate
  })
  await t.click(selectors.btnRestoreActionMenu)

  await checkToastAppearsAndDisappears(
    'The selection has been successfully restored.'
  )
  await t.fixtureCtx.vr.takeScreenshotAndUpload({
    screenshotPath: `${FEATURE_PREFIX}/${TEST_RESTORE_FOLDER}-2`,
    withMask: maskDriveFolderWithDate
  })
  console.groupEnd()
})

test(TEST_DELETE_FOLDER_FROM_DRIVE, async t => {
  console.group(
    `↳ ℹ️  ${FEATURE_PREFIX} : ${TEST_DELETE_FOLDER_FROM_DRIVE} "${FEATURE_PREFIX}-Folder1"`
  )
  await privateDrivePage.clickOnActionMenuforElementName(
    `${FEATURE_PREFIX}-Folder1`
  )
  await t.fixtureCtx.vr.takeScreenshotAndUpload({
    screenshotPath: `${FEATURE_PREFIX}/${TEST_DELETE_FOLDER_FROM_DRIVE}-1`
  })
  await t.click(selectors.btnRemoveActionMenu)
  await isExistingAndVisibile(selectors.modalFooter, 'selectors.modalFooter')

  await t.fixtureCtx.vr.takeScreenshotAndUpload({
    screenshotPath: `${FEATURE_PREFIX}/${TEST_DELETE_FOLDER_FROM_DRIVE}-2`
  })
  await t.click(selectors.btnModalSecondButton)

  await checkToastAppearsAndDisappears(
    'The selection has been moved to the Trash.'
  )
  await t.fixtureCtx.vr.takeScreenshotAndUpload({
    screenshotPath: `${FEATURE_PREFIX}/${TEST_DELETE_FOLDER_FROM_DRIVE}-3`
  })
  console.groupEnd()
})

test(TEST_NAVIGATE_IN_TRASH, async t => {
  console.group(`↳ ℹ️  ${FEATURE_PREFIX} : ${TEST_NAVIGATE_IN_TRASH}`)
  await privateDrivePage.clickOnSidebarButton(
    selectors.btnNavToTrash,
    '#/trash',
    'Trash'
  )
  await t.fixtureCtx.vr.takeScreenshotAndUpload({
    screenshotPath: `${FEATURE_PREFIX}/${TEST_NAVIGATE_IN_TRASH}-1`,
    withMask: maskDriveFolderWithDate
  })

  await privateDrivePage.goToFolder(`${FEATURE_PREFIX}-Folder1`)
  await t.fixtureCtx.vr.takeScreenshotAndUpload({
    screenshotPath: `${FEATURE_PREFIX}/${TEST_NAVIGATE_IN_TRASH}-2`,
    withMask: maskDriveFolderWithDate
  })

  await privateDrivePage.goToFolder(`${FEATURE_PREFIX}-Folder2`)
  await t.fixtureCtx.vr.takeScreenshotAndUpload({
    screenshotPath: `${FEATURE_PREFIX}/${TEST_NAVIGATE_IN_TRASH}-3`,
    withMask: maskDriveFolderWithDate
  })
  console.groupEnd()
})

test(TEST_EMPTY_TRASH, async t => {
  console.group(`↳ ℹ️  ${FEATURE_PREFIX} : ${TEST_EMPTY_TRASH}`)
  await privateDrivePage.clickOnSidebarButton(
    selectors.btnNavToTrash,
    '#/trash',
    'Trash'
  )
  await privateDrivePage.emptyTrash({
    screenshotPath: `${FEATURE_PREFIX}/${TEST_EMPTY_TRASH}-1`,
    withMask: maskDeleteFolder
  })

  //We cannot use checkToastAppearsAndDisappears here, as both toast might appears at the same time, or the 1st one may disappear before the second one shows up.
  await Promise.all([
    await isExistingAndVisibile(
      selectors.alertWrapper.withText(
        'Your trash is being emptied. This might take a few moments.'
      ),
      'selectors.alertWrapper.withText(Your trash is being emptied. This might take a few moments.)'
    ),
    await isExistingAndVisibile(
      selectors.alertWrapper.withText('The trash has been emptied.'),
      'selectors.alertWrapper.withText(The trash has been emptied.)'
    )
  ])
  await Promise.all([
    await t
      .expect(
        selectors.alertWrapper.withText(
          'Your trash is being emptied. This might take a few moments.'
        ).exists
      )
      .notOk(
        'selectors.alertWrapper.withText(Your trash is being emptied. This might take a few moments.) still exists'
      ),
    await t
      .expect(
        selectors.alertWrapper.withText('The trash has been emptied.').exists
      )
      .notOk(
        'selectors.alertWrapper.withText(The trash has been emptied.) still exists'
      )
  ])

  await t.fixtureCtx.vr.takeScreenshotAndUpload({
    screenshotPath: `${FEATURE_PREFIX}/${TEST_EMPTY_TRASH}-2`
  })
  console.groupEnd()
})
