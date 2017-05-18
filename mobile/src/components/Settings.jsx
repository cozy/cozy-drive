/* globals __DEVMODE__ */

import React from 'react'
import Main from '../../../src/components/Main'
import Topbar from '../../../src/components/Topbar'
import styles from '../styles/settings'
import DebugTools from '../containers/DebugTools'
import { translate } from '../../../src/lib/I18n'
import UploadProgression from '../containers/UploadProgression'

import About from '../containers/settings/About'
import Support from '../containers/settings/Support'
import MediaBackup from '../containers/settings/MediaBackup'
import Unlink from '../containers/settings/Unlink'

export const Settings = ({ t }) => (
  <Main>
    <Topbar>
      <h2>{t('mobile.settings.title')}</h2>
    </Topbar>
    <div>
      <div className={styles['settings']}>

        <MediaBackup />
        <About />
        <Support />
        <Unlink />

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
