import { photosUser } from '../helpers/roles' //import roles for login
import { TESTCAFE_PHOTOS_URL } from '../helpers/utils'
import Page from '../pages/photos-model'
import { DATA_PATH, IMG0, IMG1, IMG2, IMG3, IMG4 } from '../helpers/data'

import VisualReview from '../../VisualReview-node-client/index'

const vr = new VisualReview({
  //  debug: true,
  protocol: 'https',
  hostname: 'visualreview.cozycloud.cc',
  projectName: `PHOTOS on ${TESTCAFE_PHOTOS_URL}`,
  suiteName: 'fixture : Upload photos'
})
// Create run on the VisualReview server
vr.start()

const page = new Page()

fixture`Upload photos`.page`${TESTCAFE_PHOTOS_URL}/`.beforeEach(async t => {
  await t.useRole(photosUser)
  await page.waitForLoading()
})

test('Uploading 1 pic from Photos view', async t => {
  ///there is no photos on page
  await page.initPhotoCountZero()
  await page.uploadPhotos([`${DATA_PATH}${IMG0}`])

  await t.takeScreenshot('myscreenshot.png')

  // Upload a screenshot
  await vr.uploadScreenshot('./reports/screenshots/myscreenshot.png')
})

test('Uploading 4 pics from Photos view', async () => {
  await page.initPhotosCount()
  await page.uploadPhotos([
    `${DATA_PATH}${IMG1}`,
    `${DATA_PATH}${IMG2}`,
    `${DATA_PATH}${IMG3}`,
    `${DATA_PATH}${IMG4}`
  ])
})
