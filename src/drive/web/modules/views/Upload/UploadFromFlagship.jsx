import React from 'react'
import { useUploadFromFlagship } from './useUploadFromFlagship'

export const UploadFromFlagship = () => {
  const { loading } = useUploadFromFlagship()

  return (
    <div>
      <h1>Upload From Flagship Page</h1>
      <p>{loading ? 'loading' : 'Ready to call hasFilesToHandle'}</p>
    </div>
  )
}
