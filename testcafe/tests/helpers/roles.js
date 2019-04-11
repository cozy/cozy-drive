import { Role } from 'testcafe'
import {
  getPageUrl,
  TESTCAFE_PHOTOS_URL,
  TESTCAFE_DRIVE_URL,
  TESTCAFE_USER_PASSWORD
} from './utils'
import { loginButton, password } from '../pages/selectors'

export const photosUser = Role(
  `${TESTCAFE_PHOTOS_URL}/`,
  async t => {
    await t
      .typeText(password, `${TESTCAFE_USER_PASSWORD}`)
      .click(loginButton)
      .expect(getPageUrl())
      .contains('#/photos') //!FIXME don't use #/photos
  },
  { preserveUrl: true }
)

export const driveUser = Role(
  `${TESTCAFE_DRIVE_URL}/`,
  async t => {
    await t
      .typeText(password, `${TESTCAFE_USER_PASSWORD}`)
      .click(loginButton)
      .expect(getPageUrl())
      .contains('#/folder') //!FIXME don't use #/folder
  },
  { preserveUrl: true }
)
