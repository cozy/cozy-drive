import { driveUser } from '../helpers/roles'
import { TESTCAFE_DRIVE_URL, isExistingAndVisibile } from '../helpers/utils'
import * as selectors from '../pages/selectors'
import PrivateDrivePage from '../pages/drive/drive-model-private'

const privateDrivePage = new PrivateDrivePage()

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
  await isExistingAndVisibile(selectors.sidebar, 'Sidebar')

  //!FIXME change params to use key/keyword
  await privateDrivePage.isSidebarButton(
    selectors.btnNavToRecent,
    '#/recent',
    'Recent'
  )
  await privateDrivePage.clickOnSidebarButton(
    selectors.btnNavToRecent,
    '#/recent',
    'Recent'
  )
  await privateDrivePage.checkMainMenu()

  await privateDrivePage.isSidebarButton(
    selectors.btnNavToFolder,
    '#/folder',
    'Drive'
  )
  await privateDrivePage.clickOnSidebarButton(
    selectors.btnNavToFolder,
    '#/folder',
    'Drive'
  )
  await privateDrivePage.checkMainMenu()

  await privateDrivePage.isSidebarButton(
    selectors.btnNavToSharing,
    '#/sharings',
    'Sharing'
  )
  await privateDrivePage.clickOnSidebarButton(
    selectors.btnNavToSharing,
    '#/sharings',
    'Sharing'
  )
  await privateDrivePage.checkMainMenu()

  await privateDrivePage.isSidebarButton(
    selectors.btnNavToTrash,
    '#/trash',
    'Trash'
  )
  await privateDrivePage.clickOnSidebarButton(
    selectors.btnNavToTrash,
    '#/trash',
    'Trash'
  )
  await privateDrivePage.checkMainMenu()
  console.groupEnd()
})
