import React from 'react'
import { useClient, useFetchShortcut } from 'cozy-client'
import Empty from 'cozy-ui/transpiled/react/Empty'
import IconSprite from 'cozy-ui/transpiled/react/Icon/Sprite'
import { translate } from 'cozy-ui/transpiled/react/I18n'
import EmptyIcon from 'assets/icons/icon-folder-broken.svg'

const ExternalRedirect = ({ params: { fileId }, t }) => {
  const client = useClient()
  const { shortcutInfos, fetchStatus } = useFetchShortcut(client, fileId)
  if (shortcutInfos) {
    window.location.href = shortcutInfos.data.attributes.url
  }

  return (
    <>
      <IconSprite />
      {fetchStatus === 'failed' && (
        <Empty
          data-test-id="empty-share"
          icon={EmptyIcon}
          title={t('External.redirection.title')}
          text={t('External.redirection.error')}
        />
      )}
      {fetchStatus !== 'failed' && (
        <Empty
          data-test-id="empty-share"
          icon={'globe'}
          title={t('External.redirection.title')}
          text={t('External.redirection.text')}
        />
      )}
    </>
  )
}

export default translate()(ExternalRedirect)
