import { ClientFunction, Selector, t } from 'testcafe'

export const TESTCAFE_PHOTOS_URL = process.env.TESTCAFE_PHOTOS_URL
export const TESTCAFE_DRIVE_URL = process.env.TESTCAFE_DRIVE_URL
export const TESTCAFE_USER_PASSWORD = process.env.TESTCAFE_USER_PASSWORD

//Returns the URL of the current web page
export const getPageUrl = ClientFunction(() => window.location.href)

export const getElementWithTestId = Selector(
  id => document.querySelectorAll(`[data-test-id='${id}']`)
  //getElementsByAttribute is not part of W3C DOM, while querySelectorAll is.
)

//It's best practice to check both exist and visible for an element
//!FIXME : add isExistingAndVisibile in photos_crud tests
export async function isExistingAndVisibile(selector, selectorName) {
  await t
    .expect(selector.exists)
    .ok(`'${selectorName}' doesnt exist`)
    .expect(selector.visible)
    .ok(`'${selectorName}' is not visible`)
  console.log(`'${selectorName}' exists and is visible!`)
}
