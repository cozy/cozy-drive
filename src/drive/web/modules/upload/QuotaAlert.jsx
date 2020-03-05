import React from 'react'
import get from 'lodash/get'
import Modal from 'cozy-ui/transpiled/react/Modal'
import { translate } from 'cozy-ui/transpiled/react/I18n'
import { withClient } from 'cozy-client'
import withInstance from './withInstance'
import { isMobileApp } from 'cozy-device-helper'

export const buildPremiumLink = (uuid, managerUrl) =>
  `${managerUrl}/cozy/instances/${uuid}/premium`

const QuotaAlert = ({ t, onClose, client }) => {
  let uuid, managerUrl
  /**
   * We do the request only on the web since Apple
   * and Google have a retriscted policy for the
   * inApp purchase...
   */
  if (!isMobileApp()) {
    const instanceInfo = withInstance(client)
    uuid = get(instanceInfo, 'instance.data.attributes.uuid')
    managerUrl = get(instanceInfo, 'context.data.attributes.manager_url')
  }

  return (
    <Modal
      title={t('quotaalert.title')}
      description={t('quotaalert.desc')}
      secondaryText={t('quotaalert.confirm')}
      secondaryAction={onClose}
      primaryText={uuid && managerUrl ? t('quotaalert.increase') : undefined}
      primaryAction={() =>
        uuid && managerUrl
          ? window.open(buildPremiumLink(uuid, managerUrl), 'self')
          : onClose
      }
      dismissAction={onClose}
    />
  )
}

export default withClient(translate()(QuotaAlert))
