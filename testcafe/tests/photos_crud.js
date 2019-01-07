import { Selector, Role } from 'testcafe'; //import testcafe function
import { regularUser } from './helpers/roles'; //import roles for login
import config from '../config'; //import url & psswd config
import { generateRandomInteger } from './helpers/utils.js';

import Page from './pages/photos-model';

const page = new Page();


fixture `PHOTOS - CRUD`
    .page `${config.photosUrl}`
        .beforeEach(async t => {
        await t.useRole(regularUser);
        await t.resizeWindow(1280,1024); // No upload button on mobile view, beware of the size!
        t.ctx.allPhotosStartCount = await page.allPhotos.count; //Pics count at test start
    });



test("Depuis la vue Photos, j'upload 1 photo", async t => {
  //nouvelle photo apparait dans le bon cluster
  await t
        .setFilesToUpload(page.btnUpload, ['../data/IMG0.jpg'])
        .expect(page.divUpload.visible).ok()
        .expect(page.divUpload.child('h4').innerText).contains('Uploaded 1 out of 1 successfully');
  await t
        .takeScreenshot('upload_successfull1-1.png');

  const allPhotosEndCount = await page.allPhotos.count; //Pics count at the end
  await t
        .expect(allPhotosEndCount).eql(t.ctx.allPhotosStartCount + 1);
});

test("Depuis la vue Photos, j'upload 3 photos", async t => {
  //nouvelles photos apparaissent dans le bon cluster
  await t
        .setFilesToUpload(page.btnUpload, ['../data/IMG-JPG.jpg', '../data/IMG-PNG.png', '../data/IMG-GIF.gif'])
        .expect(page.divUpload.visible).ok()
        .expect(page.divUpload.child('h4').innerText).contains('Uploaded 3 out of 3 successfully');
  await t
        .takeScreenshot('upload_successfull3-3.png');

  const allPhotosEndCount = await page.allPhotos.count; //Pics count at the end
  await t
        .expect(allPhotosEndCount).eql(t.ctx.allPhotosStartCount + 3);

});

test("Depuis la vue Photos, je sélectionne 1 photo", async t => {
  //menu de sélection apparait avec ajout album, télécharger, supprimer
  await t
      .hover(page.photoThumb(0))
      .click(page.photoCheckbox.nth(0)) //Index
      .expect(page.barPhoto.visible).ok()

      .expect(page.barPhotoBtnAddtoalbum.visible).ok()
      .expect(page.barPhotoBtnDl.visible).ok()
      .expect(page.barPhotoBtnDelete.visible).ok()

      // TODO - Add check on label text ??
  });


  test("Depuis la vue Photos, je sélectionne 3 photos", async t => {
    //menu de sélection apparait avec ajout album, télécharger, supprimer
    await t
        .hover(page.photoThumb(0)) //Only one 'hover' as all checkbox should be visible once the 1st checkbox is checked
        .click(page.photoCheckbox.nth(0)) //Index
        .click(page.photoCheckbox.nth(1)) //Index
        .click(page.photoCheckbox.nth(2)) //Index
        .expect(page.barPhoto.visible).ok()

        .expect(page.barPhotoBtnAddtoalbum.visible).ok()
        .expect(page.barPhotoBtnDl.visible).ok()
        .expect(page.barPhotoBtnDelete.visible).ok()

        // TODO - Add check on label text ??
    });


test("J'ouvre une photo, la première de la liste", async t => {
  //flèche droite apparait, je peux parcourir les autres, je peux télécharger, je peux fermer (echap ou croix)
    await t
      .click(page.photoThumb(0))
      .expect(page.photoFull.visible).ok()
      .takeScreenshot('fullscreen.png');

    const photo1src = await page.photoFull.getAttribute('src');

    await t
      .expect(page.photoNavPrevious.exists).notOk() //1st photo, so previous button does not exist
      .hover(page.photoNavNext) //1st photo, so next button should exists
      .expect(page.photoNavNextBtn.visible).ok() //Next arrow is shown
      .click(page.photoNavNextBtn);

    const photo2src = await page.photoFull.getAttribute('src');
    await t
          .expect(photo1src).notEql(photo2src) //Photo has change, so src is different
          .click(page.photoBtnClose) //Pic closed using Button
          .expect(page.photoFull.exists).notOk()

          .click(page.photoThumb(0)) //re-open for closing using 'esc'
          .expect(page.photoFull.visible).ok()
          .pressKey('esc') //Pic closed using 'esc'
          .expect(page.photoFull.exists).notOk();
});


test("J'ouvre une photo, la dernière de la liste", async t => {
  //flèche droite apparait, je peux parcourir les autres, je peux télécharger, je peux fermer (echap ou croix)
    await t
      .click(page.photoThumb(t.ctx.allPhotosStartCount - 1))
      .expect(page.photoFull.visible).ok()

    const photo1src = await page.photoFull.getAttribute('src');

    await t
      .expect(page.photoNavNext.exists).notOk() //last photo, so next button does not exist
      .hover(page.photoNavPrevious) //1st photo, so prev button should exists
      .expect(page.photoNavPreviousBtn.visible).ok() //prev arrow is shown
      .click(page.photoNavPreviousBtn);

    const photo2src = await page.photoFull.getAttribute('src');
    await t
          .expect(photo1src).notEql(photo2src) //Photo has change, so src is different
          .click(page.photoBtnClose) //Pic closed using Button
          .expect(page.photoFull.exists).notOk()

          .click(page.photoThumb(t.ctx.allPhotosStartCount - 1)) //re-open for closing using 'esc'
          .expect(page.photoFull.visible).ok()
          .pressKey('esc') //Pic closed using 'esc'
          .expect(page.photoFull.exists).notOk();
});



test("J'ouvre une photo, au sein de la liste", async t => {
  //flèche droite apparait, je peux parcourir les autres, je peux télécharger, je peux fermer (echap ou croix)
  //AU moins 3 photos sur le cozy!

    const photoIndex = generateRandomInteger(1,(t.ctx.allPhotosStartCount -2));
    //Photo cannot be the first, and cannot be the last (hence -2)
    await t
      .click(page.photoThumb(photoIndex))
      .expect(page.photoFull.visible).ok()

    const photo1src = await page.photoFull.getAttribute('src');

    await t
      .hover(page.photoNavNext) //photo in between, so next button should exists
      .expect(page.photoNavNextBtn.visible).ok() //Next arrow is shown
      .hover(page.photoNavPrevious) //photo in between, so next button should exists
      .expect(page.photoNavPreviousBtn.visible).ok() //Next arrow is shown

      .click(page.photoNavPreviousBtn) //Go to photo-1
      .hover(page.photoNavNext) //photo-1 has a next button to go back to photo
      .click(page.photoNavNextBtn) //Go back to photo
      .hover(page.photoNavNext)
      .click(page.photoNavNextBtn) //Got to photo+1
      .hover(page.photoNavPrevious) //photo+1 has a previous button to go back to photo
      .click(page.photoNavPreviousBtn); //Go Back to photo



    const photo2src = await page.photoFull.getAttribute('src');
    await t
          .expect(photo1src).eql(photo2src) //In the end we are back to photo, so both src are the same
          .click(page.photoBtnClose) //Pic closed using Button
          .expect(page.photoFull.exists).notOk()

          .click(page.photoThumb(photoIndex)) //re-open for closing using 'esc'
          .expect(page.photoFull.visible).ok()
          .pressKey('esc') //Pic closed using 'esc'
          .expect(page.photoFull.exists).notOk();
});

test("Depuis la vue Photos, je supprime la 1ere photo, j'affiche la modale de confirmation, et valide la suppression", async t => {
  await t
      .hover(page.photoThumb(0))
      .click(page.photoCheckbox.nth(0)) //Index
      .expect(page.barPhoto.visible).ok()

      .click(page.barPhotoBtnDelete)
      .expect(page.modalDelete.visible).ok()
      .click(page.modalDeleteBtnDelete);
  await t
        .takeScreenshot('delete_successfull1-1.png');

  const allPhotosEndCount = await page.allPhotos.count; //Pics count at the end
  await t
        .expect(allPhotosEndCount).eql(t.ctx.allPhotosStartCount - 1);
});

test("Depuis la vue Photos, je supprime les 3 premières photos, j'affiche la modale de confirmation, et valide la suppression", async t => {
  await t
      .hover(page.photoThumb(0)) //Only one 'hover' as all checkbox should be visible once the 1st checkbox is checked
      .click(page.photoCheckbox.nth(0)) //Index
      .click(page.photoCheckbox.nth(1)) //Index
      .click(page.photoCheckbox.nth(2)) //Index
      .expect(page.barPhoto.visible).ok()

      .click(page.barPhotoBtnDelete)
      .expect(page.modalDelete.visible).ok()
      .click(page.modalDeleteBtnDelete);
  await t
        .takeScreenshot('delete_successfull3-3.png');

  const allPhotosEndCount = await page.allPhotos.count; //Pics count at the end
  await t
        .expect(allPhotosEndCount).eql(t.ctx.allPhotosStartCount - 3);
});
