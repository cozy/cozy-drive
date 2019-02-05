import { ClientFunction, Selector, t } from 'testcafe'

const INSTANCE_TESTCAFE = process.env.INSTANCE_TESTCAFE
export let TESTCAFE_PHOTOS_URL = ''
export let TESTCAFE_DRIVE_URL = ''

if (INSTANCE_TESTCAFE.includes('tools')) {
  //Local server
  const [cozy, env] = INSTANCE_TESTCAFE.split('.')
  TESTCAFE_PHOTOS_URL = `http://photos.${cozy}.${env}`
  TESTCAFE_DRIVE_URL = `http://drive.${cozy}.${env}`
} else {
  //not local server!
  const [instance, cozy, env] = INSTANCE_TESTCAFE.split('.')
  TESTCAFE_PHOTOS_URL = `https://${instance}-photos.${cozy}.${env}`
  TESTCAFE_DRIVE_URL = `https://${instance}-drive.${cozy}.${env}`
}

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
