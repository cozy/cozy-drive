import { Selector, Role } from 'testcafe'
import { getPageUrl, PHOTOS_URL, USER_PASSWORD } from './utils'

import Page from '../pages/login-model'

const page = new Page()

export const regularUser = Role(
  `${PHOTOS_URL}/`,
  async t => {
    await t
      .typeText(page.password, `${USER_PASSWORD}`)
      .click(page.loginButton)
      .expect(getPageUrl())
      .contains('#/photos') //Checks if the current page URL contains the '#/photos' string
  },
  { preserveUrl: true }
)
