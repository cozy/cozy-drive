import { useState, useEffect } from 'react'

const useFetchShortcut = (client, file) => {
  const [shortcutInfos, setShortcutInfos] = useState()
  const [shortcurtImg, setShotcutImg] = useState()
  const [fetchStatus, setFetchStatus] = useState('idle')
  useEffect(
    () => {
      const fetchData = async () => {
        setFetchStatus('loading')
        try {
          const shortcutInfosResult = await client
            .getStackClient()
            .fetchJSON('GET', `/shortcuts/${file.id}`)
          const shortcutRemoteUrl = new URL(
            shortcutInfosResult.data.attributes.url
          )

          const imgUrl = `${client.getStackClient().uri}/bitwarden/icons/${
            shortcutRemoteUrl.host
          }/icon.png`

          setShotcutImg(imgUrl)
          setShortcutInfos(shortcutInfosResult)
          setFetchStatus('loaded')
        } catch (e) {
          console.log('e', e)
          setFetchStatus('failed')
        }
      }
      fetchData()
    },
    [client]
  )

  return {
    shortcutInfos,
    shortcurtImg,
    fetchStatus
  }
}

export default useFetchShortcut
