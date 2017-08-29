/* globals __DEVMODE__ */

import React, { Component } from 'react'
import Main from '../../components/Main'
import Topbar from '../../components/Topbar'
import styles from '../styles/settings'
import DebugTools from '../containers/DebugTools'
import { translate } from 'cozy-ui/react/I18n'
import UploadProgression from '../containers/UploadProgression'

import About from '../containers/settings/About'
import Support from '../containers/settings/Support'
import MediaBackup from '../containers/settings/MediaBackup'
import Contacts from '../containers/settings/Contacts'
import Unlink from '../containers/settings/Unlink'

class Settings extends Component {
  state = {
    countClick: 0
  }

  handleClick = () => {
    this.setState(state => ({ countClick: state.countClick + 1 }))
  }

  render () {
    const { t } = this.props
    const isDebug = this.state.countClick >= 3
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
            <About onClick={this.handleClick} />
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
  }
}

export default translate()(Settings)
