import { ClientFunction } from "testcafe";

export const TESTCAFE_PHOTOS_URL = "%TESTCAFE_PHOTOS_URL.key%";
export const TESTCAFE_USER_PASSWORD = "%TESTCAFE_USER_PASSWORD.key%";

//Returns the URL of the current web page
export const getPageUrl = ClientFunction(() => window.location.href);
