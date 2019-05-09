import { driveUser } from '../helpers/roles'
import { TESTCAFE_DRIVE_URL, isExistingAndVisibile } from '../helpers/utils'

import DrivePage from '../pages/drive-model'

const drivePage = new DrivePage()

fixture`DRIVE - NAV`.page`${TESTCAFE_DRIVE_URL}/`.beforeEach(async t => {
  console.group(`\n↳ ℹ️  Loggin & Initialization`)
  await t.useRole(driveUser)
  await drivePage.waitForLoading()
  console.groupEnd()
})

test('Drive Navigation Desktop Resolution: Drive, Recent, Sharing, Trash', async () => {
  console.group(
    '↳ ℹ️  Drive Navigation Desktop Resolution: Drive, Recent, Sharing, Trash'
  )
  //Check Menu and links. Go to page. Check main menu on each page
  await isExistingAndVisibile(drivePage.sidebar, 'Sidebar')

  //!FIXME change params to use key/keyword
  await drivePage.isSidebarButton(
    drivePage.btnNavToRecent,
    '#/recent',
    'Recent'
  )
  await drivePage.clickOnSidebarButton(
    drivePage.btnNavToRecent,
    '#/recent',
    'Recent'
  )
  await drivePage.checkMainMenu()

  await drivePage.isSidebarButton(drivePage.btnNavToFolder, '#/folder', 'Drive')
  await drivePage.clickOnSidebarButton(
    drivePage.btnNavToFolder,
    '#/folder',
    'Drive'
  )
  await drivePage.checkMainMenu()

  await drivePage.isSidebarButton(
    drivePage.btnNavToSharing,
    '#/sharings',
    'Sharing'
  )
  await drivePage.clickOnSidebarButton(
    drivePage.btnNavToSharing,
    '#/sharings',
    'Sharing'
  )
  await drivePage.checkMainMenu()

  await drivePage.isSidebarButton(drivePage.btnNavToTrash, '#/trash', 'Trash')
  await drivePage.clickOnSidebarButton(
    drivePage.btnNavToTrash,
    '#/trash',
    'Trash'
  )
  await drivePage.checkMainMenu()
  console.groupEnd()
})
