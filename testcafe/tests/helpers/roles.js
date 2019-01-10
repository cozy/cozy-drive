import { Selector, Role } from "testcafe";
import config from "../../config";
import { getPageUrl } from "./utils.js";

import Page from "../pages/login-model";

const page = new Page();

export const regularUser = Role(
  `${config.photosUrl}`,
  async t => {
    await t
      .typeText(page.password, `${config.password}`)
      .click(page.loginButton)
      .expect(getPageUrl())
      .contains("#/photos"); //Checks if the current page URL contains the '#/photos' string
  },
  { preserveUrl: true }
);
