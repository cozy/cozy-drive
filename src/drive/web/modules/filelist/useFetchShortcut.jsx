import { useState, useEffect } from 'react'

const useFetchShortcut = (client, id) => {
  const [shortcutInfos, setShortcutInfos] = useState()
  const [shortcurtImg, setShotcutImg] = useState()
  const [fetchStatus, setFetchStatus] = useState('idle')
  const [shouldDisplayImg, setShouldDisplayImg] = useState(false)
  let timeout
  useEffect(
    () => {
      const fetchData = async () => {
        setFetchStatus('loading')
        try {
          const shortcutInfosResult = await client
            .getStackClient()
            .fetchJSON('GET', `/shortcuts/${id}`)
          const shortcutRemoteUrl = new URL(
            shortcutInfosResult.data.attributes.url
          )

          const imgUrl = `${client.getStackClient().uri}/bitwarden/icons/${
            shortcutRemoteUrl.host
          }/icon.png`

          setShotcutImg(imgUrl)
          // this is used in conjonction with CSS display none/block to
          // make the http request to load the image and not having a blank
          // element for a few ms
          timeout = setTimeout(() => setShouldDisplayImg(true), 400)
          setShortcutInfos(shortcutInfosResult)
          setFetchStatus('loaded')
        } catch (e) {
          console.log('e', e)
          setFetchStatus('failed')
        }
      }
      fetchData()
      return () => clearTimeout(timeout)
    },
    [client, id]
  )

  return {
    shortcutInfos,
    shortcurtImg,
    fetchStatus,
    shouldDisplayImg
  }
}

export default useFetchShortcut
