import { useSearchParams } from 'react-router-dom'

const useNextcloudPath = ({ insideTrash = false } = {}) => {
  const [searchParams] = useSearchParams()
  const defaultPath = insideTrash ? '/trash/' : '/'
  return searchParams.get('path') ?? defaultPath
}

export { useNextcloudPath }
