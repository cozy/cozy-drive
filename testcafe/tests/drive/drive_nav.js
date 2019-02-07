import { driveUser } from '../helpers/roles'
import { TESTCAFE_DRIVE_URL, isExistingAndVisibile } from '../helpers/utils'

import Page from '../pages/drive-model'

const page = new Page()

fixture`DRIVE - NAV`.page`${TESTCAFE_DRIVE_URL}/`.beforeEach(async t => {
  await t.useRole(driveUser)
})

test('Drive Navigation Desktop Resolution: Drive, Recent, Sharing, Trash', async () => {
  //Check Menu and links. Go to page. Check main menu on each page
  await isExistingAndVisibile(page.sidebar, 'Sidebar')

  //!FIXME change params to use key/keyword
  await page.isSidebarButton(page.btnNavToRecent, '#/recent', 'Recent')
  await page.clickOnSidebarButton(page.btnNavToRecent, '#/recent', 'Recent')
  await page.checkMainMenu()

  await page.isSidebarButton(page.btnNavToFolder, '#/folder', 'Drive')
  await page.clickOnSidebarButton(page.btnNavToFolder, '#/folder', 'Drive')
  await page.checkMainMenu()

  await page.isSidebarButton(page.btnNavToSharing, '#/sharings', 'Sharing')
  await page.clickOnSidebarButton(page.btnNavToSharing, '#/sharings', 'Sharing')
  await page.checkMainMenu()

  await page.isSidebarButton(page.btnNavToTrash, '#/trash', 'Trash')
  await page.clickOnSidebarButton(page.btnNavToTrash, '#/trash', 'Trash')
  await page.checkMainMenu()
})
