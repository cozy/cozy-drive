import { driveUser } from '../helpers/roles'
import {
  TESTCAFE_DRIVE_URL,
  SLUG,
  isExistingAndVisibile
} from '../helpers/utils'
import { initVR } from '../helpers/visualreview-utils'
import {
  FILE_FROM_ZIP_PATH,
  FILE_PDF,
  FILE_TXT,
  maskDriveFolderWithDate,
  maskDeleteFolder,
  maskMoveMoadal
} from '../helpers/data'
import PrivateDrivePage from '../pages/drive/drive-model-private'
import Modal from '../pages/drive/drive-modal-model'

const moveMoadal = new Modal()
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
    console.group(`\n↳ ℹ️  Loggin & Initialization`)
    await t.useRole(driveUser)
    await privateDrivePage.waitForLoading()
    console.groupEnd()
  })
  .after(async ctx => {
    await ctx.vr.checkRunStatus()
  })

test(`${TEST_CREATE_FOLDER}`, async t => {
  await t.maximizeWindow() //Real fullscren for VR
  console.group(`↳ ℹ️  ${FEATURE_PREFIX} : ${TEST_CREATE_FOLDER}`)

  await privateDrivePage.addNewFolder(
    `${FEATURE_PREFIX}-Folder1`,
    `${FEATURE_PREFIX}/${TEST_CREATE_FOLDER}-Folder1-1`
  )
  await t.fixtureCtx.vr.takeScreenshotAndUpload(
    `${FEATURE_PREFIX}/${TEST_CREATE_FOLDER}-Folder1-2`
  )

  //Create 2nd Folder
  await privateDrivePage.addNewFolder(
    `${FEATURE_PREFIX}-Folder2`,
    `${FEATURE_PREFIX}/${TEST_CREATE_FOLDER}-Folder2-1`
  )
  await t.fixtureCtx.vr.takeScreenshotAndUpload(
    `${FEATURE_PREFIX}/${TEST_CREATE_FOLDER}-Folder2-2`
  )
  console.groupEnd()
})

test(`${TEST_UPLOAD}`, async t => {
  console.group(
    `↳ ℹ️  ${FEATURE_PREFIX} : ${TEST_UPLOAD} (in "${FEATURE_PREFIX}-Folder2" folder)`
  )
  await privateDrivePage.goToFolder(`${FEATURE_PREFIX}-Folder2`)
  await t.fixtureCtx.vr.takeScreenshotAndUpload(
    `${FEATURE_PREFIX}/${TEST_UPLOAD}-1`
  )
  await privateDrivePage.uploadFiles([`${FILE_FROM_ZIP_PATH}/${FILE_PDF}`])
  await t.fixtureCtx.vr.setMaksCoordonnates(maskDriveFolderWithDate)
  await privateDrivePage.takeScreenshotsForUpload(
    `${FEATURE_PREFIX}/${TEST_UPLOAD}-2`,
    true
  )
  await privateDrivePage.uploadFiles([`${FILE_FROM_ZIP_PATH}/${FILE_TXT}`])
  await privateDrivePage.takeScreenshotsForUpload(
    `${FEATURE_PREFIX}/${TEST_UPLOAD}-3`,
    true
  )
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
    console.group(`\n↳ ℹ️  Loggin & Initialization`)
    await t.useRole(driveUser)
    await privateDrivePage.waitForLoading()
    console.groupEnd()
  })
  .after(async ctx => {
    await ctx.vr.checkRunStatus()
  })

test(`${TEST_RENAME_FILE}`, async t => {
  console.group(`↳ ℹ️  ${FEATURE_PREFIX} : ${TEST_RENAME_FILE}`)
  const [fileName, ext] = FILE_PDF.split('.')
  //set mask only once, all screen in this test use the same mask
  await t.fixtureCtx.vr.setMaksCoordonnates(maskDriveFolderWithDate)

  await privateDrivePage.goToFolder(`${FEATURE_PREFIX}-Folder2`)
  await privateDrivePage.renameElementByName(
    FILE_PDF,
    `${fileName}2.${ext}`,
    `${FEATURE_PREFIX}/${TEST_RENAME_FILE}-1`,
    { exitWithEnter: true }
  )
  await t.fixtureCtx.vr.takeScreenshotAndUpload(
    `${FEATURE_PREFIX}/${TEST_RENAME_FILE}-1-rename2`,
    true
  )

  await privateDrivePage.renameElementByName(
    `${fileName}2.${ext}`,
    FILE_PDF,
    `${FEATURE_PREFIX}/${TEST_RENAME_FILE}-2`,
    { exitWithEnter: false }
  )

  await t.fixtureCtx.vr.takeScreenshotAndUpload(
    `${FEATURE_PREFIX}/${TEST_RENAME_FILE}-2-rename2`,
    true
  )
  console.groupEnd()
})

test(`${TEST_MOVE_FILE_CANCEL}`, async t => {
  console.group(`↳ ℹ️  ${FEATURE_PREFIX} : ${TEST_MOVE_FILE_CANCEL}`)
  //set mask only once, all screen in this test use the same mask
  await privateDrivePage.goToFolder(`${FEATURE_PREFIX}-Folder2`)

  console.log('Show Action Menu & Cancel')
  await privateDrivePage.clickOnActionMenuforElementName(FILE_PDF)
  await t.fixtureCtx.vr.setMaksCoordonnates(maskDriveFolderWithDate)
  await t.fixtureCtx.vr.takeScreenshotAndUpload(
    `${FEATURE_PREFIX}/${TEST_MOVE_FILE_CANCEL}-1`,
    true
  )
  await t.pressKey('esc')

  console.log('Show Move Moadal, and Cancel (X button)')
  await privateDrivePage.showMoveModalForElement(FILE_PDF)
  // move modale show up : we need a specific mask for it
  await t.fixtureCtx.vr.setMaksCoordonnates(maskMoveMoadal)
  await t.fixtureCtx.vr.takeScreenshotAndUpload(
    `${FEATURE_PREFIX}/${TEST_MOVE_FILE_CANCEL}-2`,
    true
  )
  await isExistingAndVisibile(moveMoadal.modalClose, 'Modal button close')
  await t.click(moveMoadal.modalClose)
  await t.fixtureCtx.vr.setMaksCoordonnates(maskDriveFolderWithDate)
  await t.fixtureCtx.vr.takeScreenshotAndUpload(
    `${FEATURE_PREFIX}/${TEST_MOVE_FILE_CANCEL}-3`,
    true
  )
  //Remove comment below when https://trello.com/c/RoNPTPZV/1692-modale-d%C3%A9placement-touch-echap-ne-ferme-pas-la-modale is fixed
  // console.log('Show Move Moadal, and Cancel (esc)')
  // await privateDrivePage.showMoveModalForElement(FILE_PDF)
  // // no need to screenshot again the modal
  // await t.pressKey('esc')
  // await t.fixtureCtx.vr.takeScreenshotAndUpload(
  //   `${FEATURE_PREFIX}/${TEST_MOVE_FILE_CANCEL}-4`,
  //   true
  // )

  console.log('Show Move Moadal, and Cancel (Cancel button)')
  await privateDrivePage.showMoveModalForElement(FILE_PDF)
  // no need to screenshot again the modal
  await isExistingAndVisibile(moveMoadal.modalFirstButton)
  await t.click(moveMoadal.modalFirstButton)
  await t.fixtureCtx.vr.takeScreenshotAndUpload(
    `${FEATURE_PREFIX}/${TEST_MOVE_FILE_CANCEL}-5`,
    true
  )

  console.groupEnd()
})

test(`${TEST_MOVE_FILE}`, async t => {
  console.group(`↳ ℹ️  ${FEATURE_PREFIX} : ${TEST_MOVE_FILE}`)
  await privateDrivePage.goToFolder(`${FEATURE_PREFIX}-Folder2`)

  await privateDrivePage.showMoveModalForElement(FILE_PDF)
  // move modale show up : we need a specific mask for it
  await t.fixtureCtx.vr.setMaksCoordonnates(maskMoveMoadal)
  await t.fixtureCtx.vr.takeScreenshotAndUpload(
    `${FEATURE_PREFIX}/${TEST_MOVE_FILE}-1`,
    true
  )
  await moveMoadal.moveElementTo(`${FEATURE_PREFIX}-Folder1`)
  await t.fixtureCtx.vr.setMaksCoordonnates(maskDriveFolderWithDate)
  await t.fixtureCtx.vr.takeScreenshotAndUpload(
    `${FEATURE_PREFIX}/${TEST_MOVE_FILE}-2`,
    true
  )
  console.groupEnd()
})

test(`${TEST_MOVE_FOLDER}`, async t => {
  console.group(`↳ ℹ️  ${FEATURE_PREFIX} : ${TEST_MOVE_FOLDER}`)

  await privateDrivePage.showMoveModalForElement(`${FEATURE_PREFIX}-Folder2`)
  // move modale show up : we need a specific mask for it
  await t.fixtureCtx.vr.setMaksCoordonnates(maskMoveMoadal)
  await t.fixtureCtx.vr.takeScreenshotAndUpload(
    `${FEATURE_PREFIX}/${TEST_MOVE_FOLDER}-1`,
    true
  )
  await moveMoadal.moveElementTo(`${FEATURE_PREFIX}-Folder1`)
  await t.fixtureCtx.vr.setMaksCoordonnates(maskDriveFolderWithDate)
  await t.fixtureCtx.vr.takeScreenshotAndUpload(
    `${FEATURE_PREFIX}/${TEST_MOVE_FOLDER}-2`,
    true
  )
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
    console.group(`\n↳ ℹ️  Loggin & Initialization`)
    await t.useRole(driveUser)
    await privateDrivePage.waitForLoading()
    console.groupEnd()
  })
  .after(async ctx => {
    await ctx.vr.checkRunStatus()
  })

test(`${TEST_DELETE_FOLDER}`, async t => {
  console.group(
    `↳ ℹ️  ${FEATURE_PREFIX} : ${TEST_DELETE_FOLDER} "${FEATURE_PREFIX}-Folder1"`
  )
  await privateDrivePage.goToFolder(`${FEATURE_PREFIX}-Folder1`)
  await t.fixtureCtx.vr.setMaksCoordonnates(maskDriveFolderWithDate)
  await t.fixtureCtx.vr.takeScreenshotAndUpload(
    `${FEATURE_PREFIX}/${TEST_DELETE_FOLDER}-1`,
    true
  )

  await t.fixtureCtx.vr.setMaksCoordonnates(maskDeleteFolder)
  await privateDrivePage.deleteCurrentFolder(
    `${FEATURE_PREFIX}/${TEST_DELETE_FOLDER}-2`
  )
  await t.fixtureCtx.vr.takeScreenshotAndUpload(
    `${FEATURE_PREFIX}/${TEST_DELETE_FOLDER}-3`
  )
  console.groupEnd()
})

test(`${TEST_RESTORE_FOLDER}`, async t => {
  console.group(
    `↳ ℹ️  ${FEATURE_PREFIX} : ${TEST_RESTORE_FOLDER} "${FEATURE_PREFIX}-Folder1"`
  )
  await privateDrivePage.clickOnSidebarButton(
    privateDrivePage.btnNavToTrash,
    '#/trash',
    'Trash'
  )
  await privateDrivePage.clickOnActionMenuforElementName(
    `${FEATURE_PREFIX}-Folder1`
  )
  await t.fixtureCtx.vr.setMaksCoordonnates(maskDriveFolderWithDate)
  await t.fixtureCtx.vr.takeScreenshotAndUpload(
    `${FEATURE_PREFIX}/${TEST_RESTORE_FOLDER}-1`,
    true
  )
  await t.click(privateDrivePage.restoreButtonActionMenu).wait(1000)
  await t.fixtureCtx.vr.takeScreenshotAndUpload(
    `${FEATURE_PREFIX}/${TEST_RESTORE_FOLDER}-2`,
    true
  )
  console.groupEnd()
})

test(`${TEST_DELETE_FOLDER_FROM_DRIVE}`, async t => {
  console.group(
    `↳ ℹ️  ${FEATURE_PREFIX} : ${TEST_DELETE_FOLDER_FROM_DRIVE} "${FEATURE_PREFIX}-Folder1"`
  )
  await privateDrivePage.clickOnActionMenuforElementName(
    `${FEATURE_PREFIX}-Folder1`
  )
  await t.fixtureCtx.vr.takeScreenshotAndUpload(
    `${FEATURE_PREFIX}/${TEST_DELETE_FOLDER_FROM_DRIVE}-1`
  )
  await t.click(privateDrivePage.removeButtonActionMenu)
  await isExistingAndVisibile(privateDrivePage.modalFooter, 'Modal delete')

  await t.fixtureCtx.vr.takeScreenshotAndUpload(
    `${FEATURE_PREFIX}/${TEST_DELETE_FOLDER_FROM_DRIVE}-2`
  )
  await t.click(privateDrivePage.modalSecondButton)
  await isExistingAndVisibile(
    privateDrivePage.alertWrapper,
    '"successfull" modal alert'
  )

  await t.fixtureCtx.vr.takeScreenshotAndUpload(
    `${FEATURE_PREFIX}/${TEST_DELETE_FOLDER_FROM_DRIVE}-3`
  )
  console.groupEnd()
})

test(`${TEST_NAVIGATE_IN_TRASH}`, async t => {
  console.group(`↳ ℹ️  ${FEATURE_PREFIX} : ${TEST_NAVIGATE_IN_TRASH}`)
  await privateDrivePage.clickOnSidebarButton(
    privateDrivePage.btnNavToTrash,
    '#/trash',
    'Trash'
  )
  await t.fixtureCtx.vr.setMaksCoordonnates(maskDriveFolderWithDate)
  await t.fixtureCtx.vr.takeScreenshotAndUpload(
    `${FEATURE_PREFIX}/${TEST_NAVIGATE_IN_TRASH}-1`,
    true
  )
  await privateDrivePage.goToFolder(`${FEATURE_PREFIX}-Folder1`)
  await t.fixtureCtx.vr.takeScreenshotAndUpload(
    `${FEATURE_PREFIX}/${TEST_NAVIGATE_IN_TRASH}-2`,
    true
  )
  await privateDrivePage.goToFolder(`${FEATURE_PREFIX}-Folder2`)
  await t.fixtureCtx.vr.takeScreenshotAndUpload(
    `${FEATURE_PREFIX}/${TEST_NAVIGATE_IN_TRASH}-3`,
    true
  )
  console.groupEnd()
})

test(`${TEST_EMPTY_TRASH}`, async t => {
  console.group(`↳ ℹ️  ${FEATURE_PREFIX} : ${TEST_EMPTY_TRASH}`)
  await privateDrivePage.clickOnSidebarButton(
    privateDrivePage.btnNavToTrash,
    '#/trash',
    'Trash'
  )
  await t.fixtureCtx.vr.setMaksCoordonnates(maskDriveFolderWithDate)

  await privateDrivePage.emptyTrash(`${FEATURE_PREFIX}/${TEST_EMPTY_TRASH}-1`)
  await t.fixtureCtx.vr.takeScreenshotAndUpload(
    `${FEATURE_PREFIX}/${TEST_EMPTY_TRASH}-2`
  )
  //wait for trash to be empty
  await t.wait(2000)
  await t.fixtureCtx.vr.takeScreenshotAndUpload(
    `${FEATURE_PREFIX}/${TEST_EMPTY_TRASH}-3`
  )
  console.groupEnd()
})
