import { Selector, Role } from "testcafe";
import config from "../../config";
import { getPageUrl } from "./utils.js";


export const regularUser = Role(`${config.loginUrl}`, async t => {
  await t
    .typeText(Selector("#password"), `${config.password}`)
    .click(Selector("#login-submit").find(".password-form"))
    .expect(getPageUrl())
    .contains("home"); //Checks if the current page URL contains the 'home' string
});
