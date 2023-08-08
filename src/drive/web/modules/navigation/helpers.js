/**
 * Returns true if `to` and `pathname` match
 * Supports `rx` for regex matches.
 */
export const navLinkMatch = (rx, to, pathname) => {
  return rx ? rx.test(pathname) : pathname.slice(1) === to
}
