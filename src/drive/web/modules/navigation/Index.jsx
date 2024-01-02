import { useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'

import { useClient, Q, models } from 'cozy-client'

import { getSharingIdFromUrl } from './duck'
import { SHAREDWITHME_DIR_ID } from 'constants/config'
import AcceptingSharingContext from 'drive/lib/AcceptingSharingContext'

/**
 * Compute sharing object according to the sharing found in io.cozy.sharings and the sharing context
 * @param {object} params - Params
 * @param {object} params.client - The CozyClient instance
 * @param {string} params.sharingId - Id of an io.cozy.sharings doc
 * @param {object} params.sharingsValue - Sharing Context value
 * @returns {object}
 */
const computeSharingsValue = async ({ client, sharingId, sharingsValue }) => {
  const sharingRes = await client.query(
    Q('io.cozy.sharings').getById(sharingId)
  )
  const computedSharingsValue = Object.assign(
    { [`${sharingRes.data.id}`]: sharingRes.data },
    sharingsValue
  )
  return computedSharingsValue
}

/**
 * Fetches io.cozy.sharings with the sharing Id
 * stores the sharing in the context
 * and route to the folder that contains the shared file
 * @param {object} params - Params
 * @param {object} params.client - The CozyClient instance
 * @param {object} params.sharingsValue - Sharing Context value
 * @param {function} params.setSharingsValue - Sharing Context setter
 * @param {function} params.setFileValue - Sharing Context file setter
 * @param {object} params.navigate - Lets you navigate programmatically
 * @param {string} params.sharingId - Id of an io.cozy.sharings doc
 */
export const fetchSharing = async ({
  client,
  sharingsValue,
  setSharingsValue,
  setFileValue,
  navigate,
  sharingId
}) => {
  if (!sharingId) {
    return navigate('/folder', { replace: true })
  }

  try {
    const referencedFilesRes = await client
      .collection('io.cozy.files')
      .findReferencedBy({ _type: 'io.cozy.sharings', _id: sharingId })

    const referencedFiles = referencedFilesRes.included

    const hasReferencedFile = referencedFiles.length >= 1
    const referencedFile = hasReferencedFile ? referencedFiles[0] : null

    const isSharingShortcut = hasReferencedFile
      ? models.file.isSharingShortcut(referencedFile)
      : false

    if (isSharingShortcut) {
      setFileValue(referencedFile)
    }

    if (!hasReferencedFile || isSharingShortcut) {
      const computedSharingsValue = await computeSharingsValue({
        client,
        sharingId,
        sharingsValue
      })
      setSharingsValue(computedSharingsValue)
    }

    if (!hasReferencedFile) {
      return navigate(`/folder/${SHAREDWITHME_DIR_ID}`, { replace: true })
    }
    return navigate(`/folder/${referencedFile.dir_id}`, { replace: true })
  } catch (e) {
    // eslint-disable-next-line
    console.warn(
      `fetchSharing error : ${e}. Redirect to /folder/${SHAREDWITHME_DIR_ID}`
    )
    return navigate(`/folder/${SHAREDWITHME_DIR_ID}`, { replace: true })
  }
}

const Index = () => {
  const client = useClient()
  const navigate = useNavigate()
  const { sharingsValue, setFileValue, setSharingsValue } = useContext(
    AcceptingSharingContext
  )

  const sharingId = getSharingIdFromUrl(window.location)

  useEffect(() => {
    fetchSharing({
      client,
      sharingsValue,
      setSharingsValue,
      navigate,
      sharingId,
      setFileValue
    })
  }, [
    client,
    sharingId,
    navigate,
    setSharingsValue,
    setFileValue,
    sharingsValue
  ])

  return null
}

export default Index
