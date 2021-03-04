import React from 'react'
import PropTypes from 'prop-types'

import { useClient } from 'cozy-client'
import { openFileWith } from 'cozy-client/dist/models/fsnative'
import { isIOS } from 'cozy-device-helper'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import Button from 'cozy-ui/transpiled/react/Button'
import ReplyIcon from 'cozy-ui/transpiled/react/Icons/Reply'
import ShareIosIcon from 'cozy-ui/transpiled/react/Icons/ShareIos'
import Alerter from 'cozy-ui/transpiled/react/Alerter'

const ForwardIcon = isIOS() ? ShareIosIcon : ReplyIcon

const ForwardButton = ({ file }) => {
  const { t } = useI18n()
  const client = useClient()

  const onFileOpen = async file => {
    try {
      await openFileWith(client, file)
    } catch (error) {
      Alerter.info(`mobile.error.open_with.${error}`, { fileMime: file.mime })
    }
  }

  return (
    <Button
      extension="full"
      theme="secondary"
      icon={ForwardIcon}
      label={t('Viewer.actions.forward')}
      onClick={() => onFileOpen(file)}
    />
  )
}

ForwardButton.propTypes = {
  file: PropTypes.object.isRequired
}

export default ForwardButton
