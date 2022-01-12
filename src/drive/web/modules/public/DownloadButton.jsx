import React from 'react'
import PropTypes from 'prop-types'

import { useClient } from 'cozy-client'
import { Button, useI18n } from 'cozy-ui/transpiled/react'
import DownloadIcon from 'cozy-ui/transpiled/react/Icons/Download'

import { downloadFiles } from 'drive/web/modules/actions/utils'

const DownloadButton = ({ onDownload, ...props }) => (
  <Button onClick={() => onDownload()} icon={DownloadIcon} {...props} />
)

export default DownloadButton

export const DownloadFilesButton = ({ files }) => {
  const { t } = useI18n()
  const client = useClient()
  return (
    <DownloadButton
      label={t('toolbar.menu_download')}
      data-testid="fil-public-download"
      onDownload={() => {
        downloadFiles(client, files)
      }}
      theme="secondary"
    />
  )
}
DownloadFilesButton.propTypes = {
  files: PropTypes.array.isRequired
}
