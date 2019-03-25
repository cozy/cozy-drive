import { driveUser } from '../helpers/roles'
import { TESTCAFE_DRIVE_URL, isExistingAndVisibile } from '../helpers/utils'

import PrivateprivateDrivePage from '../pages/drive-model-private'

const privateDrivePage = new PrivateprivateDrivePage()

fixture`DRIVE - NAV`.page`${TESTCAFE_DRIVE_URL}/`.beforeEach(async t => {
  console.group(`\n↳ ℹ️  Loggin & Initialization`)
  await t.useRole(driveUser)
  await privateDrivePage.waitForLoading()
  console.groupEnd()
})

test('Drive Navigation Desktop Resolution: Drive, Recent, Sharing, Trash', async () => {
  console.group(
    '↳ ℹ️  Drive Navigation Desktop Resolution: Drive, Recent, Sharing, Trash'
  )
  //Check Menu and links. Go to page. Check main menu on each page
  await isExistingAndVisibile(privateDrivePage.sidebar, 'Sidebar')

  //!FIXME change params to use key/keyword
  await privateDrivePage.isSidebarButton(
    privateDrivePage.btnNavToRecent,
    '#/recent',
    'Recent'
  )
  await privateDrivePage.clickOnSidebarButton(
    privateDrivePage.btnNavToRecent,
    '#/recent',
    'Recent'
  )
  await privateDrivePage.checkMainMenu()

  await privateDrivePage.isSidebarButton(
    privateDrivePage.btnNavToFolder,
    '#/folder',
    'Drive'
  )
  await privateDrivePage.clickOnSidebarButton(
    privateDrivePage.btnNavToFolder,
    '#/folder',
    'Drive'
  )
  await privateDrivePage.checkMainMenu()

  await privateDrivePage.isSidebarButton(
    privateDrivePage.btnNavToSharing,
    '#/sharings',
    'Sharing'
  )
  await privateDrivePage.clickOnSidebarButton(
    privateDrivePage.btnNavToSharing,
    '#/sharings',
    'Sharing'
  )
  await privateDrivePage.checkMainMenu()

  await privateDrivePage.isSidebarButton(
    privateDrivePage.btnNavToTrash,
    '#/trash',
    'Trash'
  )
  await privateDrivePage.clickOnSidebarButton(
    privateDrivePage.btnNavToTrash,
    '#/trash',
    'Trash'
  )
  await privateDrivePage.checkMainMenu()
  console.groupEnd()
})
