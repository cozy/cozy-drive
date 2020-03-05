import React from 'react'
import { withClient } from 'cozy-client'
import useFetchShortcut from 'drive/web/modules/filelist/useFetchShortcut'
import { Empty } from 'cozy-ui/transpiled/react'
import { IconSprite } from 'cozy-ui/transpiled/react'
import { translate } from 'cozy-ui/transpiled/react/I18n'
const ExternalRedirect = ({ client, params: { fileId }, t }) => {
  const { shortcutInfos } = useFetchShortcut(client, fileId)
  if (shortcutInfos) {
    //window.location.href = shortcutInfos.data.attributes.url
  }

  return (
    <>
      <IconSprite />
      <Empty
        data-test-id="empty-share"
        icon={'globe'}
        title={t('External.redirection.title')}
        text={t('External.redirection.text')}
      />
    </>
  )
}

export default translate()(withClient(ExternalRedirect))
