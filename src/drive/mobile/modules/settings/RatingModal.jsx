import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { ConfirmDialog } from 'cozy-ui/transpiled/react/CozyDialogs'
import Alerter from 'cozy-ui/transpiled/react/Alerter'
import Button from 'cozy-ui/transpiled/react/Button'
import { translate } from 'cozy-ui/transpiled/react/I18n'

import withPersistentState from '../../lib/withPersistentState'
import { SOFTWARE_NAME, APP_STORE_ID, APP_MARKET_ID } from '../../lib/constants'
import FeedbackForm from './components/FeedbackForm'

const SCREEN_ENJOY = 'SCREEN_ENJOY'
const SCREEN_FEEDBACK = 'SCREEN_FEEDBACK'

const BUTTON_INDEX_RATE = 1
const BUTTON_INDEX_LATER = 2

const PROMPT_AFTER_BOOTS = 10
const PROMPT_AFTER_DAYS = 7

// RatingModal is the base component
class RatingModal extends Component {
  state = {
    screen: SCREEN_ENJOY
  }
  onUserReply = async enjoyed => {
    if (enjoyed) {
      try {
        const { t } = this.props
        const buttonIndex = await promptRating({
          title: t('mobile.rating.rate.title'),
          message: '',
          yes: t('mobile.rating.rate.yes'),
          no: t('mobile.rating.rate.no'),
          later: t('mobile.rating.rate.later'),
          appMarketID: APP_MARKET_ID,
          appStoreID: APP_STORE_ID,
          softwareName: SOFTWARE_NAME
        })

        if (buttonIndex === BUTTON_INDEX_LATER) {
          Alerter.info('mobile.rating.alert.later')
          this.props.showLater()
        } else if (buttonIndex === BUTTON_INDEX_RATE) {
          Alerter.info('mobile.rating.alert.rated')
          this.props.dontShowAgain()
        } else {
          Alerter.info('mobile.rating.alert.declined')
          this.props.dontShowAgain()
        }
      } catch (e) {
        this.props.dontShowAgain()
        throw e
      }
    } else {
      this.setState({ screen: SCREEN_FEEDBACK })
    }
  }

  onCloseFeedback = gaveFeedback => {
    if (gaveFeedback) Alerter.info('mobile.rating.alert.feedback')
    this.props.dontShowAgain()
  }

  render() {
    const { t } = this.props
    return this.state.screen === SCREEN_ENJOY ? (
      <EnjoyCozy onReply={this.onUserReply} t={t} />
    ) : (
      <FeedbackForm onClose={this.onCloseFeedback} t={t} />
    )
  }
}

RatingModal.propTypes = {
  dontShowAgain: PropTypes.func.isRequired,
  showLater: PropTypes.func.isRequired
}

// sub-components
const EnjoyCozy = props => {
  const { onReply, t } = props

  return (
    <ConfirmDialog
      open
      title={t('mobile.rating.enjoy.title')}
      actions={
        <>
          <Button
            theme={'secondary'}
            extension="full"
            onClick={() => onReply(false)}
            label={t('mobile.rating.enjoy.no')}
          />
          <Button
            extension="full"
            onClick={() => onReply(true)}
            label={t('mobile.rating.enjoy.yes')}
          />
        </>
      }
    />
  )
}

EnjoyCozy.propTypes = {
  onReply: PropTypes.func.isRequired
}

// promptRating is not a component because the native UI is used instead
const promptRating = async ({
  title,
  message,
  yes,
  no,
  later,
  softwareName,
  appMarketID,
  appStoreID
}) =>
  new Promise((resolve, reject) => {
    if (!window.AppRate) reject(new Error('No AppRate found'))
    try {
      window.AppRate.preferences = {
        displayAppName: softwareName,
        inAppReview: true,
        storeAppURL: {
          ios: appStoreID,
          android: appMarketID
        },
        customLocale: {
          title,
          message,
          cancelButtonLabel: no,
          laterButtonLabel: later,
          rateButtonLabel: yes,
          yesButtonLabel: yes,
          noButtonLabel: no
        },
        callbacks: {
          onButtonClicked: resolve
        }
      }

      window.AppRate.promptForRating()
    } catch (e) {
      reject(e)
    }
  })

// Enhance the base component with HOCs
const withBootDelay = (WrappedComponent, showAfterBoots) => {
  // we want to increment the count once per application boot, *not* per mount/constructor/etc
  let hasIncrementedBootCount = false

  class WithBootDelay extends Component {
    state = {
      bootCount: 0,
      promptAfter:
        new Date().getTime() + PROMPT_AFTER_DAYS * 24 * 60 * 60 * 1000,
      prompted: false
    }

    componentStateRestored() {
      if (hasIncrementedBootCount) return

      this.setState(prevState => ({
        bootCount: ++prevState.bootCount
      }))
      hasIncrementedBootCount = true
    }

    dontShowAgain = () => {
      this.setState(state => ({ ...state, prompted: true }))
    }

    showLater = () => {
      this.setState(state => ({
        ...state,
        bootCount: 0,
        prompted: false
      }))
    }

    render() {
      const { bootCount, promptAfter, prompted } = this.state
      const timeRemainingBeforePrompt = promptAfter - new Date().getTime()
      const visible =
        prompted === false &&
        bootCount >= showAfterBoots &&
        timeRemainingBeforePrompt <= 0
      return (
        visible && (
          <WrappedComponent
            dontShowAgain={this.dontShowAgain}
            showLater={this.showLater}
            {...this.props}
          />
        )
      )
    }
  }

  WithBootDelay.displayName = `WithBootDelay(${
    WrappedComponent.displayName || WrappedComponent.name || 'Component'
  })`
  return WithBootDelay
}

const DelayedRatingModal = withBootDelay(
  translate()(RatingModal),
  PROMPT_AFTER_BOOTS
)

const PersistentRatingModal = withPersistentState(
  DelayedRatingModal,
  'DelayedRatingModal'
)

export default PersistentRatingModal
