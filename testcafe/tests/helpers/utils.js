import { ClientFunction } from 'testcafe'

export const PHOTOS_URL = process.env.PHOTOS_URL
export const USER_PASSWORD = process.env.USER_PASSWORD

//Returns the URL of the current web page
export const getPageUrl = ClientFunction(() => window.location.href)
