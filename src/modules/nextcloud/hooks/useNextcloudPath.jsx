import { useSearchParams } from 'react-router-dom'

const useNextcloudPath = () => {
  const [searchParams] = useSearchParams()
  return searchParams.get('path') ?? '/'
}

export { useNextcloudPath }
