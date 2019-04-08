import React from 'react'
import { Button, Icon } from 'cozy-ui/transpiled/react'
import { translate } from 'cozy-ui/react/I18n'

import styles from 'viewer/styles.styl'
import IconCloud from 'components/icons/icon-cloud-wrong.svg'

const NoNetworkViewer = ({ t, onReload }) => (
  <div className={styles['pho-viewer-canceled']}>
    <Icon icon={IconCloud} width={160} height={140} />
    <h2>{t('Viewer.loading.error')}</h2>
    <Button onClick={onReload} label={t('Viewer.loading.retry')} />
  </div>
)

export default translate()(NoNetworkViewer)
