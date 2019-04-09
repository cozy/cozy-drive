/* globals __DEVELOPMENT__ cozy */

import React, { Component } from 'react'
import { translate } from 'cozy-ui/react/I18n'
import Alerter from 'cozy-ui/react/Alerter'
import Main from 'drive/web/modules/layout/Main'

import DebugTools from './components/DebugTools'
import About from './components/About'
import Support from './components/Support'
import MediaBackup from './components/MediaBackup'
import Unlink from './components/Unlink'
import FeedbackForm from './components/FeedbackForm'

import styles from './styles'

const { BarCenter } = cozy.bar

class Settings extends Component {
  state = {
    tapCount: 0,
    displayFeedback: false
  }

  incrementTapCount = () => {
    this.setState(state => ({ tapCount: state.tapCount + 1 }))
  }

  displayFeedbackForm = () => {
    this.setState(state => ({ ...state, displayFeedback: true }))
  }
  hideFeedbackForm = result => {
    this.setState(state => ({ ...state, displayFeedback: false }))
    result && Alerter.info('mobile.rating.alert.feedback')
  }

  render() {
    const { t } = this.props
    const isDebug = this.state.tapCount >= 3
    return (
      <Main>
        <BarCenter>
          <h2 className={styles['settings__title']}>
            {t('mobile.settings.title')}
          </h2>
        </BarCenter>
        <div>
          <div className={styles['settings']}>
            <MediaBackup />
            <Support
              isDebug={isDebug}
              sendFeedback={this.displayFeedbackForm}
            />
            <About onTap={this.incrementTapCount} t={t} />
            <Unlink />

            {__DEVELOPMENT__ && [
              <hr key={1} />,
              <h3 key={2}>Debug Zone</h3>,
              <DebugTools key={3} />
            ]}
          </div>
          {this.state.displayFeedback && (
            <FeedbackForm onClose={this.hideFeedbackForm} />
          )}
        </div>
      </Main>
    )
  }
}

export default translate()(Settings)
