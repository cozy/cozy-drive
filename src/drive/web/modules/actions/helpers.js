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
  const documents = Array.isArray(files) ? files : [files]
  navigate(`${pathname}${pathname.endsWith('/') ? '' : '/'}${path}`, {
    state: { fileIds: documents.map(file => file.id) }
  })
}
