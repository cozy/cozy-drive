import { useEffect, useState } from 'react'
import { useClient } from 'cozy-client'
import { fetchFolder } from '../queries/fetchFolder'
import log from 'cozy-logger'

export const useBreadcrumbPath = ({
  currentFolderId,
  rootBreadcrumbPath,
  sharedDocumentIds
}) => {
  const client = useClient()
  const [paths, setPaths] = useState([])

  useEffect(() => {
    const hasAccessToSharedDocument = id => {
      if (!sharedDocumentIds) return true
      return !sharedDocumentIds.includes(id)
    }

    let isSubscribed = true
    const returnedPaths = []

    const fetchBreadcrumbs = async () => {
      let id = currentFolderId
      while (!!id && id !== rootBreadcrumbPath.id) {
        const folder = await fetchFolder({ client, folderId: id })
        if (!folder) {
          id = undefined
        } else {
          returnedPaths.unshift({ name: folder.name, id: folder.id })
          id = hasAccessToSharedDocument(folder.id) ? folder.dir_id : undefined
        }
      }

      if (isSubscribed) {
        if (rootBreadcrumbPath.name !== 'Public') {
          returnedPaths.unshift(rootBreadcrumbPath)
        }
        setPaths(returnedPaths)
      }
    }

    fetchBreadcrumbs().catch(error => {
      if (rootBreadcrumbPath && rootBreadcrumbPath.name === 'Public') {
        if (isSubscribed) {
          setPaths(returnedPaths)
        }
      } else {
        log(
          'error',
          `Error while fetching folder for breadcrumbs of folder id: ${currentFolderId}, here is the error: ${error}`
        )
      }
    })

    return () => {
      isSubscribed = false
    }
  }, [currentFolderId, client, sharedDocumentIds, rootBreadcrumbPath])

  return paths
}
