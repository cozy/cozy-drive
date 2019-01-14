import { ClientFunction } from 'testcafe'
<<<<<<< HEAD
<<<<<<< HEAD

export const PHOTOS_URL = process.env.PHOTOS_URL
export const USER_PASSWORD = process.env.USER_PASSWORD
=======
>>>>>>> style: Prettier with eslint
=======
>>>>>>> test: testcafe tests update and travis configuration

export const TESTCAFE_PHOTOS_URL = process.env.TESTCAFE_PHOTOS_URL
export const TESTCAFE_USER_PASSWORD = process.env.TESTCAFE_USER_PASSWORD

//Returns the URL of the current web page
export const getPageUrl = ClientFunction(() => window.location.href)
