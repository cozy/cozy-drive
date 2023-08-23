import { useSearchParams } from 'react-router-dom'
import { useWebviewIntent } from 'cozy-intent'
import { useEffect, useState } from 'react'

export const useUploadFromFlagship = () => {
  const [loading, setLoading] = useState(true)
  const [searchParams] = useSearchParams()
  const webviewIntent = useWebviewIntent()
  const fromFlagshipUpload = searchParams.get('fromFlagshipUpload')

  useEffect(() => {
    if (fromFlagshipUpload && webviewIntent) {
      setLoading(false)
    }
  }, [fromFlagshipUpload, webviewIntent])

  return {
    loading
  }
}
