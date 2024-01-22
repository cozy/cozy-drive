export const navigateToModal = ({ navigate, pathname, files, path }) => {
  const file = Array.isArray(files) ? files[0] : files
  return navigate(
    `${pathname}${pathname.endsWith('/') ? '' : '/'}file/${file.id}/${path}`
  )
}

export const navigateToModalWithMultipleFile = ({
  navigate,
  pathname,
  files,
  path
}) => {
  navigate(`${pathname}${pathname.endsWith('/') ? '' : '/'}${path}`, {
    state: { fileIds: files.map(file => file.id) }
  })
}
