/**
 * This helper function is used to change the location of the current window
 * This main purpose is to help for testing
 * @param {string} url - The url to change the location to
 */
export const changeLocation = url => {
  window.location = url
}
