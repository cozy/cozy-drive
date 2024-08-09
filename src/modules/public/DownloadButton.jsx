import PropTypes from 'prop-types'
import React from 'react'

import { useClient } from 'cozy-client'
import Button from 'cozy-ui/transpiled/react/Buttons'
import Icon from 'cozy-ui/transpiled/react/Icon'
import DownloadIcon from 'cozy-ui/transpiled/react/Icons/Download'
import { useAlert } from 'cozy-ui/transpiled/react/providers/Alert'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import { downloadFiles } from 'modules/actions/utils'

const DownloadButton = ({ onDownload, ...props }) => (
  <Button
    onClick={() => onDownload()}
    startIcon={<Icon icon={DownloadIcon} />}
    {...props}
  />
)

export default DownloadButton

export const DownloadFilesButton = ({ files, className }) => {
  const { t } = useI18n()
  const client = useClient()
  const { showAlert } = useAlert()

  return (
    <DownloadButton
      label={t('toolbar.menu_download')}
      data-testid="fil-public-download"
      onDownload={() => {
        downloadFiles(client, files, { showAlert, t })
      }}
      variant="secondary"
      className={className}
    />
  )
}
DownloadFilesButton.propTypes = {
  files: PropTypes.array.isRequired
}
