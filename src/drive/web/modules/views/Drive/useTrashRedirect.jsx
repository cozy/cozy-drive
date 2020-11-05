import { useEffect } from 'react'

import { useRouter } from 'drive/lib/RouterContext'
import { TRASH_DIR_PATH } from 'drive/constants/config'
export const useTrashRedirect = displayedFolder => {
  const { router } = useRouter()
  useEffect(
    () => {
      if (displayedFolder && displayedFolder.path.startsWith(TRASH_DIR_PATH)) {
        router.push({
          pathname: '/trash/' + displayedFolder.id
        })
      }
    },
    [router, displayedFolder]
  )
}
