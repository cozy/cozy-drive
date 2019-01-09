import { Selector, Role } from "testcafe"; //import testcafe function
import { regularUser } from "./helpers/roles"; //import roles for login
import config from "../config"; //import url & psswd config
const _ = require("lodash");
//cmt

import Page from "./pages/photos-model";

const page = new Page();

fixture`PHOTOS - CRUD`.page`${config.photosUrl}`.beforeEach(async t => {
  await t.useRole(regularUser);
  await t.resizeWindow(1280, 1024); // No upload button on mobile view, beware of the size!
  t.ctx.allPhotosStartCount = await page.allPhotos.count; //Pics count at test start
});

test("Uploading 1 pic from Photos view", async t => {
  //new pic shows up
  await t
    .setFilesToUpload(page.btnUpload, ["../data/IMG0.jpg"])
    .expect(page.divUpload.visible)
    .ok();
  await t
    .expect(page.divUpload.child("h4").innerText)
    .contains("Uploaded 1 out of 1 successfully");
  await t.takeScreenshot("upload_successfull1-1.png");

  const allPhotosEndCount = await page.allPhotos.count; //Pics count at the end
  await t.expect(allPhotosEndCount).eql(t.ctx.allPhotosStartCount + 1);
});

test("Deleting 1st pic in Photo view : Open up a modal, and confirm", async t => {
  //pic is removed
  await t
    .hover(page.photoThumb(0))
    .click(page.photoCheckbox.nth(0)) //Index
    .expect(page.barPhoto.visible)
    .ok()

    .click(page.barPhotoBtnDelete)
    .expect(page.modalDelete.visible)
    .ok()
    .click(page.modalDeleteBtnDelete);
  await t.takeScreenshot("delete_successfull1-1.png");

  const allPhotosEndCount = await page.allPhotos.count; //Pics count at the end
  await t.expect(allPhotosEndCount).eql(t.ctx.allPhotosStartCount - 1);
});
