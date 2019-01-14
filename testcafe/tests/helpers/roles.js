import { Selector, Role } from 'testcafe'
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
import { getPageUrl, PHOTOS_URL, USER_PASSWORD } from './utils'
=======
import config from '../../config'
import { getPageUrl } from './utils.js'
>>>>>>> style: Prettier with eslint
=======
import { getPageUrl, PHOTOS_URL, USER_PASSWORD } from './utils'
>>>>>>> refactor: Some fix to code according to PR comments 
=======
import { getPageUrl, PHOTOS_URL, USER_PASSWORD } from './utils'
>>>>>>> test: testcafe tests update and travis configuration
=======
import {
  getPageUrl,
  TESTCAFE_PHOTOS_URL,
  TESTCAFE_USER_PASSWORD
} from './utils'
>>>>>>> chore: Travis encrypted envirronement vars

import Page from '../pages/login-model'

const page = new Page()

export const regularUser = Role(
  `${TESTCAFE_PHOTOS_URL}/`,
  async t => {
    await t
      .typeText(page.password, `${TESTCAFE_USER_PASSWORD}`)
      .click(page.loginButton)
      .expect(getPageUrl())
      .contains('#/photos') //Checks if the current page URL contains the '#/photos' string
  },
  { preserveUrl: true }
)
