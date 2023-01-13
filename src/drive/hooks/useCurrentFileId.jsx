import { useParams } from 'react-router-dom'

const useCurrentFileId = () => {
  const { fileId } = useParams()

  if (fileId) {
    return fileId
  }
  return null
}

export default useCurrentFileId
