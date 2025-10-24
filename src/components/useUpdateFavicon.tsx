import get from 'lodash/get'
import { useCallback } from 'react'

import { IOCozyFile } from 'cozy-client/types/types'
import flag from 'cozy-flags'

import { getFileMimetype } from '@/lib/getFileMimetype'

const useUpdateFavicon = (
  file: IOCozyFile | undefined,
  fetchStatus: string
): void => {
  const updateFavicon = useCallback((url: string): void => {
    const links =
      document.querySelectorAll<HTMLLinkElement>("link[rel~='icon']")

    links.forEach(link => {
      link.rel = 'icon'
      link.type = 'image/svg+xml'
      link.href = url

      document.head.appendChild(link)
    })
  }, [])

  const defaultFavicon = '/assets/favicon.ico'

  if (
    fetchStatus !== 'loaded' ||
    !file ||
    !flag('drive.update-favicon.enabled')
  ) {
    updateFavicon(defaultFavicon)
    return
  }

  const faviconByMimetype = {
    text: '/favicons/icon-onlyoffice-text.ico',
    sheet: '/favicons/icon-onlyoffice-sheet.ico',
    slide: '/favicons/icon-onlyoffice-slide.ico'
  }

  const type = getFileMimetype(faviconByMimetype)(
    file.mime,
    file.name
  ) as string

  const favicon = get(faviconByMimetype, type, defaultFavicon) as string
  updateFavicon(favicon)
}

export default useUpdateFavicon
