import { Selector, Role } from 'testcafe'
import {
  getPageUrl,
  TESTCAFE_PHOTOS_URL,
  TESTCAFE_DRIVE_URL,
  TESTCAFE_USER_PASSWORD
} from './utils'

import Page from '../pages/login-model'

const page = new Page()

export const photosUser = Role(
  `${TESTCAFE_PHOTOS_URL}/`,
  async t => {
    await t
      .typeText(page.password, `${TESTCAFE_USER_PASSWORD}`)
      .click(page.loginButton)
      .expect(getPageUrl())
      .contains('#/photos') //!FIXME don't use #/photos
  },
  { preserveUrl: true }
)

export const driveUser = Role(
  `${TESTCAFE_DRIVE_URL}/`,
  async t => {
    await t
      .typeText(page.password, `${TESTCAFE_USER_PASSWORD}`)
      .click(page.loginButton)
      .expect(getPageUrl())
      .contains('#/folder') //!FIXME don't use #/folder
  },
  { preserveUrl: true }
)
