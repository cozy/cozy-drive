export function makePath(root, filename) {
  return `${root}${root.endsWith('/') ? '' : '/'}${filename}`
}
