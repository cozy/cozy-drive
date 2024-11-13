import React, { FC, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { useClient } from 'cozy-client'
import { fetchURL } from 'cozy-client/dist/models/note'
import Empty from 'cozy-ui/transpiled/react/Empty'
import Sprite from 'cozy-ui/transpiled/react/Icon/Sprite'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import EmptyIcon from 'assets/icons/icon-folder-broken.svg'
import { joinPath } from 'lib/path'

const PublicNoteRedirectView: FC = () => {
  const { t } = useI18n()
  const { fileId } = useParams()
  const client = useClient()

  const [noteUrl, setNoteUrl] = useState<string | null>(null)
  const [fetchStatus, setFetchStatus] = useState<
    'failed' | 'loading' | 'pending' | 'loaded'
  >('pending')

  useEffect(() => {
    const fetchNoteUrl = async (fileId: string): Promise<void> => {
      setFetchStatus('loading')
      try {
        const url = await fetchURL(
          client,
          {
            id: fileId
          },
          {
            pathname: joinPath(location.pathname, '')
          }
        )
        setNoteUrl(url)
        setFetchStatus('loaded')
      } catch (error) {
        setFetchStatus('failed')
      }
    }

    if (fileId) {
      void fetchNoteUrl(fileId)
    }
  }, [fileId, client])

  if (noteUrl) {
    window.location.href = noteUrl
  }

  return (
    <>
      <Sprite />
      {fetchStatus === 'failed' && (
        <Empty
          icon={EmptyIcon}
          title={t('External.redirection.title')}
          text={t('External.redirection.error')}
        />
      )}
      {fetchStatus !== 'failed' && (
        <Empty
          icon="globe"
          title={t('External.redirection.title')}
          text={t('External.redirection.text')}
        />
      )}
    </>
  )
}

export { PublicNoteRedirectView }
