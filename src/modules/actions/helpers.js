import { joinPath } from 'lib/path'

export const navigateToModal = ({ navigate, pathname, files, path }) => {
  const file = Array.isArray(files) ? files[0] : files
  return navigate(joinPath(pathname, `file/${file.id}/${path}`))
}

export const navigateToModalWithMultipleFile = ({
  navigate,
  pathname,
  files,
  path,
  search
}) => {
  navigate(
    { pathname: joinPath(pathname, path), search: search ? `?${search}` : '' },
    {
      state: { fileIds: files.map(file => file.id) }
    }
  )
}
