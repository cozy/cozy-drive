import React from 'react'
import get from 'lodash/get'
import Modal from 'cozy-ui/react/Modal'
import { translate } from 'cozy-ui/react/I18n'
import { withClient } from 'cozy-client'
import withInstance from './withInstance'

const buildPremiumLink = (uuid, managerUrl) =>
  `${managerUrl}/cozy/instances/${uuid}/premium`

const QuotaAlert = ({ t, onClose, client }) => {
  const instanceInfo = withInstance(client)
  const uuid = get(instanceInfo, 'instance.data.attributes.uuid')
  const managerUrl = get(instanceInfo, 'context.data.attributes.manager_url')

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

export default translate()(withClient(QuotaAlert))
