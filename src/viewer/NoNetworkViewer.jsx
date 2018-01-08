import React from 'react'
import { Button } from 'cozy-ui/react/Button'
import { translate } from 'cozy-ui/react/I18n'

import styles from './styles'

const NoNetworkViewer = ({ t, onReload }) => (
  <div className={styles['pho-viewer-canceled']}>
    <h2>{t('Viewer.loading.error')}</h2>
    <Button theme="regular" onClick={onReload}>
      {t('Viewer.loading.retry')}
    </Button>
  </div>
)

export default translate()(NoNetworkViewer)
