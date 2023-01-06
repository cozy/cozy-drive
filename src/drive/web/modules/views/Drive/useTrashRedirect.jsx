import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { TRASH_DIR_PATH } from 'drive/constants/config'
export const useTrashRedirect = displayedFolder => {
  const navigate = useNavigate()

  useEffect(() => {
    if (displayedFolder && displayedFolder.path.startsWith(TRASH_DIR_PATH)) {
      navigate('/trash/' + displayedFolder.id)
    }
  }, [navigate, displayedFolder])
}
