import { useEffect, useState } from 'react'
import get from 'lodash/get'
import { useClient } from 'cozy-client'
import { buildFolderQuery } from 'drive/web/modules/queries'
import { ROOT_DIR_ID } from '../../../constants/config'

export const useBreadcrumbPath = ({ currentFolderId }) => {
  const client = useClient()
  const [paths, setPaths] = useState([])

  useEffect(
    () => {
      let isSubscribed = true

      const fetchFolder = async ({ client, folderId }) => {
        const folderQuery = buildFolderQuery(folderId)
        const { options, definition } = folderQuery
        const folderQueryResults = await client.query(definition(), options)
        return get(folderQueryResults, 'data')
      }

      // How to use async functions in useEffect:
      // https://devtrium.com/posts/async-functions-useeffect#write-the-asynchronous-function-inside-the-useeffect
      const fetchBreadcrumbs = async () => {
        let idParentFolder = currentFolderId
        let STAY = true
        let returnedPaths = []
        while (idParentFolder !== ROOT_DIR_ID && !!idParentFolder && STAY) {
          let folder = await fetchFolder({ client, folderId: idParentFolder })
          if (!folder) {
            folder = await fetchFolder({ client, folderId: idParentFolder })
            if (!folder) {
              STAY = false
            }
            if (idParentFolder) {
              throw new Error(
                `je ne comprends pas pourquoi Cozy Client n' arrive pas à fetch le folder id: ${idParentFolder}`
              )
            }
          }
          let { id, name, dir_id } = folder

          const path = {
            name,
            id
          }
          returnedPaths.push(path) // find a way to push before
          idParentFolder = dir_id
        }

        if (isSubscribed) {
          returnedPaths.push({
            name: 'ROOT',
            id: ROOT_DIR_ID
          })
          setPaths(returnedPaths)
        }
      }

      fetchBreadcrumbs().catch(console.error) // eslint-disable-line no-console

      return () => {
        isSubscribed = false
      }
    },
    [currentFolderId, client]
  )

  return paths
}
