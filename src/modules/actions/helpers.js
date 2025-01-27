import { joinPath } from 'lib/path'

export const navigateToModal = ({ navigate, pathname, files, path }) => {
  const file = Array.isArray(files) ? files[0] : files

  return navigate(
    pathname ? joinPath(pathname, `file/${file.id}/${path}`) : `v/${path}`
  )
}

export const navigateToModalWithMultipleFile = ({
  navigate,
  pathname,
  files,
  path,
  search
}) => {
  return navigate(
    {
      pathname: pathname ? joinPath(pathname, path) : `v/${path}`,
      search: search ? `?${search}` : ''
    },
    {
      state: { fileIds: files.map(file => file.id) }
    }
  )
}
