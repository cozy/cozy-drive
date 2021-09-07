import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { useClient } from 'cozy-client'
import { useVaultClient } from 'cozy-keys-lib'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import DownloadIcon from 'cozy-ui/transpiled/react/Icons/Download'
import Button from 'cozy-ui/transpiled/react/Button'
import Alerter from 'cozy-ui/transpiled/react/Alerter'

import { downloadFile } from '../helpers'
import { getFolderEncryptionKey } from 'drive/web/modules/selectors'

const DownloadButton = ({ file, encryptionKey }) => {
  const { t } = useI18n()
  const client = useClient()
  const vaultClient = useVaultClient()

  console.log('encryption key in dl button component: ', encryptionKey)
  const handleClick = async file => {
    try {
      await downloadFile(client, file, { vaultClient, encryptionKey })
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

const mapStateToProps = state => ({
  encryptionKey: getFolderEncryptionKey(state)
})

DownloadButton.propTypes = {
  file: PropTypes.object.isRequired
}

export default connect(mapStateToProps)(DownloadButton)
