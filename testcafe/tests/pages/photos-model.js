import { Selector } from "testcafe";

export default class Page {
  constructor() {
    this.nameInput = Selector("#developer-name");

    this.btnUpload = Selector('[class*="pho-toolbar"]')
      .find("span")
      .find("input");
    this.divUpload = Selector('[class*="upload-queue"]');

    this.modalUpload = Selector('[class*="c-alert-wrapper"]', {
      visibilityCheck: true
    });

    this.photoThumb = value => {
      return Selector('[class*="pho-photo-item"]').nth(value);
    };

    // Photo fullscreen
    this.photoFull = Selector('[class*="pho-viewer-imageviewer"]').find("img");
    this.photoNavNext = Selector('[class*="pho-viewer-nav--next"]');
    this.photoNavNextBtn = this.photoNavNext.find(
      '[class*="pho-viewer-nav-arrow"]'
    );
    this.photoNavPrevious = Selector('[class*="pho-viewer-nav--previous"]');
    this.photoNavPreviousBtn = this.photoNavPrevious.find(
      '[class*="pho-viewer-nav-arrow"]'
    );

    this.photoBtnClose = Selector('[class*="pho-viewer-toolbar-close"]').find(
      '[class*="c-btn"]'
    );
    this.photoToolbar = Selector(
      '[class*="coz-selectionbar pho-viewer-toolbar-actions"]'
    ); //.find('button') -> DL button

    this.photoCheckbox = Selector(
      '[class*="pho-photo-select"][data-input="checkbox"]'
    );
    //Top Option bar & Confirmation Modal
    this.barPhoto = Selector('[class*="coz-selectionbar"]');
    this.barPhotoBtnAddtoalbum = this.barPhoto.find("button").nth(0); //ADD TO ALBUM
    this.barPhotoBtnDl = this.barPhoto.find("button").nth(1); //DOWNLOAD
    this.barPhotoBtnDelete = this.barPhoto.find("button").nth(2); //DELETE
    this.modalDelete = Selector('[class*="c-modal"]').find("div");
    this.modalDeleteBtnDelete = this.modalDelete.find("button").nth(2); //REMOVE
    this.allPhotos = Selector('[class^="pho-photo"]').find(
      '[class^="pho-photo-item"]'
    );
  }
}
