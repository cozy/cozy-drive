/* globals __DEVELOPMENT__ */

import React, { Component } from 'react'
import Main from '../../components/Main'
import Topbar from '../../components/Topbar'
import styles from '../styles/settings'
import DebugTools from '../containers/DebugTools'
import { translate } from 'cozy-ui/react/I18n'
import UploadStatus from '../containers/UploadStatus'

import About from '../containers/settings/About'
import Support from '../containers/settings/Support'
import MediaBackup from '../containers/settings/MediaBackup'
import Contacts from '../containers/settings/Contacts'
import Unlink from '../containers/settings/Unlink'

class Settings extends Component {
  state = {
    tapCount: 0
  }

  incrementTapCount = () => {
    this.setState(state => ({ tapCount: state.tapCount + 1 }))
  }

  render() {
    const { t } = this.props
    const isDebug = this.state.tapCount >= 3
    return (
      <Main>
        <Topbar>
          <h2>{t('mobile.settings.title')}</h2>
        </Topbar>
        <div>
          <div className={styles['settings']}>
            <MediaBackup />
            <Contacts />
            <Support isDebug={isDebug} />
            <About onTap={this.incrementTapCount} />
            <Unlink />

            {__DEVELOPMENT__ && [<hr />, <h3>Debug Zone</h3>, <DebugTools />]}
          </div>
          <UploadStatus />
        </div>
      </Main>
    )
  }
}

export default translate()(Settings)
