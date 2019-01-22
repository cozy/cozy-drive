import { ClientFunction, Selector, t } from 'testcafe'

export const TESTCAFE_PHOTOS_URL = process.env.TESTCAFE_PHOTOS_URL
export const TESTCAFE_USER_PASSWORD = process.env.TESTCAFE_USER_PASSWORD

//Returns the URL of the current web page
export const getPageUrl = ClientFunction(() => window.location.href)

export const elWithDataTest = Selector(
  id => document.querySelectorAll("[data-test-id='" + id + "']")
  //getElementsByAttribute is not part of W3C DOM, while querySelectorAll is.
)
