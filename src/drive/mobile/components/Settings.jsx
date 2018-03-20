/* globals __DEVELOPMENT__ cozy */

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Main from '../../components/Main'
import styles from '../styles/settings'
import DebugTools from '../containers/DebugTools'
import { translate } from 'cozy-ui/react/I18n'

import About from '../containers/settings/About'
import Support from '../containers/settings/Support'
import MediaBackup from '../containers/settings/MediaBackup'
import Unlink from '../containers/settings/Unlink'
import FeedbackForm from '../containers/FeedbackForm'

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
    result && this.props.alert('mobile.rating.alert.feedback')
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
            <About onTap={this.incrementTapCount} />
            <Unlink />

            {__DEVELOPMENT__ && [<hr />, <h3>Debug Zone</h3>, <DebugTools />]}
          </div>
          {this.state.displayFeedback && (
            <FeedbackForm onClose={this.hideFeedbackForm} />
          )}
        </div>
      </Main>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  alert: message =>
    dispatch({
      type: 'ALERT_RATING',
      alert: { message }
    })
})

export default translate()(connect(null, mapDispatchToProps)(Settings))
