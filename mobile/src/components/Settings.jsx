/* globals __DEVMODE__ */

import React from 'react'
import Modal from 'cozy-ui/react/Modal'
import Main from '../../../src/components/Main'
import Topbar from '../../../src/components/Topbar'
import styles from '../styles/settings'
import DebugTools from '../containers/DebugTools'
import { translate } from '../../../src/lib/I18n'
import UploadProgression from '../containers/UploadProgression'

import About from '../containers/settings/About'
import Support from '../containers/settings/Support'
import MediaBackup from '../containers/settings/MediaBackup'

export const Settings = ({ t, client, showUnlinkConfirmation, displayUnlinkConfirmation, hideUnlinkConfirmation, unlink }) => (
  <Main>
    <Topbar>
      <h2>{t('mobile.settings.title')}</h2>
    </Topbar>
    <div>
      <div className={styles['settings']}>

        <MediaBackup />
        <About />
        <Support />

        <h3 className={styles['settings__category-title']}>{t('mobile.settings.unlink.title')}</h3>
        <p>{t('mobile.settings.unlink.description')}</p>
        <button className={styles['settings__button-danger']} onClick={showUnlinkConfirmation}>{t('mobile.settings.unlink.button')}</button>
        {displayUnlinkConfirmation && <Modal
          title={t('mobile.settings.unlink.confirmation.title')}
          description={t('mobile.settings.unlink.confirmation.description')}
          secondaryText={t('mobile.settings.unlink.confirmation.cancel')}
          secondaryAction={hideUnlinkConfirmation}
          primaryType='danger'
          primaryText={t('mobile.settings.unlink.confirmation.unlink')}
          primaryAction={() => unlink(client)}
        />}

        {__DEVMODE__ &&
          [
            <hr />,
            <h3>Debug Zone</h3>,
            <DebugTools />
          ]
        }

      </div>
      <UploadProgression />
    </div>
  </Main>
)

export default translate()(Settings)
