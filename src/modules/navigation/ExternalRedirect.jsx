import React from 'react'
import { useParams } from 'react-router-dom'

import { useClient, useFetchShortcut } from 'cozy-client'
import Empty from 'cozy-ui/transpiled/react/Empty'
import { translate } from 'cozy-ui/transpiled/react/providers/I18n'

import EmptyIcon from 'assets/icons/icon-folder-broken.svg'
import { DummyLayout } from 'modules/layout/DummyLayout'

const ExternalRedirect = ({ t }) => {
  const { fileId } = useParams()
  const client = useClient()
  const { shortcutInfos, fetchStatus } = useFetchShortcut(client, fileId)
  if (shortcutInfos) {
    window.location.href = shortcutInfos.data.attributes.url
  }

  return (
    <DummyLayout>
      {fetchStatus === 'failed' && (
        <Empty
          data-testid="empty-share"
          icon={EmptyIcon}
          title={t('External.redirection.title')}
          text={t('External.redirection.error')}
        />
      )}
      {fetchStatus !== 'failed' && (
        <Empty
          data-testid="empty-share"
          icon="globe"
          title={t('External.redirection.title')}
          text={t('External.redirection.text')}
        />
      )}
    </DummyLayout>
  )
}

export default translate()(ExternalRedirect)
