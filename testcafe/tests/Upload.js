import { Selector, Role } from 'testcafe';
import { regularUser } from './helpers/roles';

fixture `Upload`
    .page `http://localphotos.cozy.tools:8080/`
        .beforeEach(async t => {
        await t.useRole(regularUser);
        // Resize window
        await t.resizeWindow(1280,1024);
    });
 
test('Upload Photo', async t => {


 
    const divUpload = await Selector(".upload-queue--2RXFj");
   await t


        .setFilesToUpload((Selector('span').withText('UPLOAD').find('input')), ['../data/IMG.jpg'])
     //   .click(Selector('span').withText('UPLOAD').find('input'))
        .expect(divUpload.visible).ok()
        .expect(divUpload.child('h4').innerText).contains('Uploaded 1 out of 1 successfully')
     
      .click(Selector('.pho-photo--1RccV').find('.pho-photo-item--1uvPt'))

      .expect(Selector('.pho-viewer-imageviewer--3ExG_ > img').visible).ok()
      .click(Selector('.pho-viewer-toolbar-close--5j5zF > .c-btn--3Vk8q'))

      .hover(Selector('.pho-photo--1RccV').find('.pho-photo-item--1uvPt'))
      .click(Selector('.pho-photo-select--2_YlY[data-input="checkbox"]').find('label'))
      .expect(Selector('.coz-selectionbar--3yrJ2').visible).ok()
      .click(Selector('button.c-btn--3Vk8q:nth-child(5)'))
      .expect(Selector('.c-modal--2ICub').visible).ok()
      .click(Selector('button.c-btn--3Vk8q:nth-child(2)'))
});
