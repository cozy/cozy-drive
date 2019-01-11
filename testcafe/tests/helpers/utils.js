import { ClientFunction } from 'testcafe'

//Returns the URL of the current web page
export const getPageUrl = ClientFunction(() => window.location.href)
