import { Selector, Role } from 'testcafe' //import testcafe function
import { regularUser } from './helpers/roles' //import roles for login
<<<<<<< HEAD
<<<<<<< HEAD
import { getPageUrl, PHOTOS_URL } from './helpers/utils'
import random from 'lodash/random'
=======
import config from '../config' //import url & psswd config
//import { generateRandomInteger } from "./helpers/utils.js";
const _ = require('lodash')
>>>>>>> style: Prettier with eslint
=======
import { getPageUrl, PHOTOS_URL } from './helpers/utils'
import random from 'lodash/random'
>>>>>>> refactor: Some fix to code according to PR comments 

import Page from './pages/photos-model'

const page = new Page()

<<<<<<< HEAD
<<<<<<< HEAD
fixture`PHOTOS - CRUD`.page`${PHOTOS_URL}/`.beforeEach(async t => {
=======
fixture`PHOTOS - CRUD`.page`${config.photosUrl}`.beforeEach(async t => {
>>>>>>> style: Prettier with eslint
=======
fixture`PHOTOS - CRUD`.page`${PHOTOS_URL}/`.beforeEach(async t => {
>>>>>>> refactor: Some fix to code according to PR comments 
  await t.useRole(regularUser)

  await t.resizeWindow(1280, 1024) // No upload button on mobile view, beware of the size!

  t.ctx.allPhotosStartCount = await page.allPhotos.count //Pics count at test start
  console.log('beforeEach > allPhotosStartCount ' + t.ctx.allPhotosStartCount)
})

test('Uploading 1 pic from Photos view', async t => {
  //new pic shows up

  await t
    .setFilesToUpload(page.btnUpload, ['../data/IMG0.jpg'])
    .expect(page.divUpload.visible)
    .ok()
    .expect(page.modalUpload.exists)
    .ok({ timeout: 50000 })
    .expect(page.divUpload.child('h4').innerText)
    .contains('Uploaded 1 out of 1 successfully')
  await t.takeScreenshot()

  const allPhotosEndCount = await page.allPhotos.count //Pics count at the end
  console.log('allPhotosEndCount ' + allPhotosEndCount)
  await t.expect(allPhotosEndCount).eql(t.ctx.allPhotosStartCount + 1)
})

test('Uploading 3 pcis from Photos view', async t => {
  //new pics show up

  await t
    .setFilesToUpload(page.btnUpload, [
      '../data/IMG-JPG.jpg',
      '../data/IMG-PNG.png',
      '../data/IMG-GIF.gif'
    ])
    .expect(page.divUpload.visible)
    .ok()
    .expect(page.modalUpload.exists)
    .ok({ timeout: 50000 })
    .expect(page.divUpload.child('h4').innerText)
    .contains('Uploaded 3 out of 3 successfully')
  await t.takeScreenshot()

  const allPhotosEndCount = await page.allPhotos.count //Pics count at the end
  console.log('allPhotosEndCount ' + allPhotosEndCount)

  await t.expect(allPhotosEndCount).eql(t.ctx.allPhotosStartCount + 3)
})

test('Select 1 pic from Photos view', async t => {
  //Selection bar shows up. It includes AddtoAlbun, Download and Delete buttons
  await t
    .hover(page.photoThumb(0))
    .click(page.photoCheckbox.nth(0)) //Index
    .expect(page.barPhoto.visible)
    .ok()

    .expect(page.barPhotoBtnAddtoalbum.visible)
    .ok()
    .expect(page.barPhotoBtnDl.visible)
    .ok()
    .expect(page.barPhotoBtnDelete.visible)
    .ok()

  // TODO - Add check on label text ??
})

test('Select 3 pic from Photos view', async t => {
  //Selection bar shows up. It includes AddtoAlbun, Download and Delete buttons
  await t
    .hover(page.photoThumb(0)) //Only one 'hover' as all checkbox should be visible once the 1st checkbox is checked
    .click(page.photoCheckbox.nth(0)) //Index
    .click(page.photoCheckbox.nth(1)) //Index
    .click(page.photoCheckbox.nth(2)) //Index
    .expect(page.barPhoto.visible)
    .ok()

    .expect(page.barPhotoBtnAddtoalbum.visible)
    .ok()
    .expect(page.barPhotoBtnDl.visible)
    .ok()
    .expect(page.barPhotoBtnDelete.visible)
    .ok()

  // TODO - Add check on label text ??
})

test('Open 1st pic', async t => {
  //Right arrow shows up. Navigatio to other pics is OK, Closing pic (X or 'esc') is Ok

  await t
    .click(page.photoThumb(0))
    .expect(page.photoFull.visible)
    .ok()
    .takeScreenshot()

  const photo1src = await page.photoFull.getAttribute('src')

  await t
    .expect(page.photoNavPrevious.exists)
    .notOk() //1st photo, so previous button does not exist
    .hover(page.photoNavNext) //1st photo, so next button should exists
    .expect(page.photoNavNextBtn.visible)
    .ok() //Next arrow is shown
    .click(page.photoNavNextBtn)

  const photo2src = await page.photoFull.getAttribute('src')
  await t
    .expect(photo1src)
    .notEql(photo2src) //Photo has change, so src is different
    .click(page.photoBtnClose) //Pic closed using Button
    .expect(page.photoFull.exists)
    .notOk()

    .click(page.photoThumb(0)) //re-open for closing using 'esc'
    .expect(page.photoFull.visible)
    .ok()
    .pressKey('esc') //Pic closed using 'esc'
    .expect(page.photoFull.exists)
    .notOk()
})

test('Open Last pic', async t => {
  //Left arrow shows up. Navigatio to other pics is OK, Closing pic (X or 'esc') is Ok

  await t
    .click(page.photoThumb(t.ctx.allPhotosStartCount - 1))
    .expect(page.photoFull.visible)
    .ok()

  const photo1src = await page.photoFull.getAttribute('src')

  await t
    .expect(page.photoNavNext.exists)
    .notOk() //last photo, so next button does not exist
    .hover(page.photoNavPrevious) //1st photo, so prev button should exists
    .expect(page.photoNavPreviousBtn.visible)
    .ok() //prev arrow is shown
    .click(page.photoNavPreviousBtn)

  const photo2src = await page.photoFull.getAttribute('src')
  await t
    .expect(photo1src)
    .notEql(photo2src) //Photo has change, so src is different
    .click(page.photoBtnClose) //Pic closed using Button
    .expect(page.photoFull.exists)
    .notOk()

    .click(page.photoThumb(t.ctx.allPhotosStartCount - 1)) //re-open for closing using 'esc'
    .expect(page.photoFull.visible)
    .ok()
    .pressKey('esc') //Pic closed using 'esc'
    .expect(page.photoFull.exists)
    .notOk()
})

test('Open a random pic (not first nor last)', async t => {
  //Both arrows show up. Navigatio to other pics is OK, Closing pic (X or 'esc') is Ok
  // We need at least 3 pics in our cozy for this test to pass

<<<<<<< HEAD
<<<<<<< HEAD
  const photoIndex = random(1, t.ctx.allPhotosStartCount - 2)
=======
  const photoIndex = _.random(1, t.ctx.allPhotosStartCount - 2)
>>>>>>> style: Prettier with eslint
=======
  const photoIndex = random(1, t.ctx.allPhotosStartCount - 2)
>>>>>>> refactor: Some fix to code according to PR comments 

  console.log('Open random pic  > photoIndex ' + photoIndex)

  //Photo cannot be the first, and cannot be the last (hence -2)
  await t
    .click(page.photoThumb(photoIndex))
    .expect(page.photoFull.visible)
    .ok()

  const photo1src = await page.photoFull.getAttribute('src')

  await t
    .hover(page.photoNavNext) //photo in between, so next button should exists
    .expect(page.photoNavNextBtn.visible)
    .ok() //Next arrow is shown
    .hover(page.photoNavPrevious) //photo in between, so next button should exists
    .expect(page.photoNavPreviousBtn.visible)
    .ok() //Next arrow is shown

    .click(page.photoNavPreviousBtn) //Go to photo-1
    .hover(page.photoNavNext) //photo-1 has a next button to go back to photo
    .click(page.photoNavNextBtn) //Go back to photo
    .hover(page.photoNavNext)
    .click(page.photoNavNextBtn) //Got to photo+1
    .hover(page.photoNavPrevious) //photo+1 has a previous button to go back to photo
    .click(page.photoNavPreviousBtn) //Go Back to photo

  const photo2src = await page.photoFull.getAttribute('src')
  await t
    .expect(photo1src)
    .eql(photo2src) //In the end we are back to photo, so both src are the same
    .click(page.photoBtnClose) //Pic closed using Button
    .expect(page.photoFull.exists)
    .notOk()

    .click(page.photoThumb(photoIndex)) //re-open for closing using 'esc'
    .expect(page.photoFull.visible)
    .ok()
    .pressKey('esc') //Pic closed using 'esc'
    .expect(page.photoFull.exists)
    .notOk()
})

test('Deleting 1st pic in Photo view : Open up a modal, and confirm', async t => {
  //pic is removed
  await t
    .hover(page.photoThumb(0))
    .click(page.photoCheckbox.nth(0)) //Index
    .expect(page.barPhoto.visible)
    .ok()

    .click(page.barPhotoBtnDelete)
    .expect(page.modalDelete.visible)
    .ok()
    .click(page.modalDeleteBtnDelete)
  await t.takeScreenshot()

  const allPhotosEndCount = await page.allPhotos.count //Pics count at the end
  console.log('allPhotosEndCount ' + allPhotosEndCount)

  await t.expect(allPhotosEndCount).eql(t.ctx.allPhotosStartCount - 1)
})

test('Deleting the 1st 3 pics in Photo view : Open up a modal, and confirm', async t => {
  //pics are removed
  await t
    .hover(page.photoThumb(0)) //Only one 'hover' as all checkbox should be visible once the 1st checkbox is checked
    .click(page.photoCheckbox.nth(0)) //Index
    .click(page.photoCheckbox.nth(1)) //Index
    .click(page.photoCheckbox.nth(2)) //Index
    .expect(page.barPhoto.visible)
    .ok()

    .click(page.barPhotoBtnDelete)
    .expect(page.modalDelete.visible)
    .ok()
    .click(page.modalDeleteBtnDelete)
  await t.takeScreenshot()

  const allPhotosEndCount = await page.allPhotos.count //Pics count at the end
  console.log('allPhotosEndCount ' + allPhotosEndCount)

  await t.expect(allPhotosEndCount).eql(t.ctx.allPhotosStartCount - 3)
})
