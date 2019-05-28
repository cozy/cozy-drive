import { t } from 'testcafe'
import * as selectors from './selectors'
import { isExistingAndVisibile } from '../helpers/utils'

//this files contains function that can be use both in photos and drive

//Check that the alert toast exist, and wait for it to disappear
export async function checkToastAppearsAndDisappears(toastText) {
  await t
  isExistingAndVisibile(
    selectors.alertWrapper.withText(toastText),
    `selectors.alertWrapper.withText(${toastText})`
  )
  await t
    .expect(selectors.alertWrapper.withText(toastText).exists)
    .notOk(`selectors.alertWrapper.withText(${toastText}) still exists`)
}
