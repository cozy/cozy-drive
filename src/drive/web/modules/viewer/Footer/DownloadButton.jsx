import React from 'react'
import PropTypes from 'prop-types'

import { useClient } from 'cozy-client'
import { useVaultClient } from 'cozy-keys-lib'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import DownloadIcon from 'cozy-ui/transpiled/react/Icons/Download'
import Button from 'cozy-ui/transpiled/react/Button'
import Alerter from 'cozy-ui/transpiled/react/Alerter'

import { downloadFile } from '../helpers'

const DownloadButton = ({ file }) => {
  const { t } = useI18n()
  const client = useClient()
  const vaultClient = useVaultClient()

  const handleClick = async file => {
    try {
      await downloadFile(client, file, { vaultClient })
    } catch (error) {
      Alerter.info('Viewer.error.generic')
    }
  }
  return (
    <Button
      extension="full"
      theme="secondary"
      icon={DownloadIcon}
      label={t('Viewer.actions.download')}
      onClick={() => handleClick(file)}
    />
  )
}

DownloadButton.propTypes = {
  file: PropTypes.object.isRequired
}

export default DownloadButton
