/* global cozy */
import React, { Component } from 'react'
import Modal, { ModalContent } from 'cozy-ui/react/Modal'
import { Button } from 'cozy-ui/react'
import { connect } from 'react-redux'
import withPersistentState from '../lib/withPersistentState'
import { SOFTWARE_ID, SOFTWARE_NAME } from '../lib/constants'

import styles from '../styles/feedback'

const SCREEN_ENJOY = 'SCREEN_ENJOY'
const SCREEN_FEEDBACK = 'SCREEN_FEEDBACK'
const ALERT_RATING = 'ALERT_RATING'

const BUTTON_INDEX_RATE = 1
const BUTTON_INDEX_LATER = 2

const FEEDBACK_EMAIL = 'contact@cozycloud.cc'
const PROMPT_AFTER_BOOTS = 5

// RatingModal is the base component
class RatingModal extends Component {
  state = {
    screen: SCREEN_ENJOY
  }

  onUserReply = async enjoyed => {
    if (enjoyed) {
      try {
        const { t } = this.context
        const buttonIndex = await promptRating({
          title: t('mobile.rating.rate.title'),
          message: '',
          yes: t('mobile.rating.rate.yes'),
          no: t('mobile.rating.rate.no'),
          later: t('mobile.rating.rate.later'),
          softwareID: SOFTWARE_ID,
          softwareName: SOFTWARE_NAME
        })

        if (buttonIndex === BUTTON_INDEX_LATER) {
          this.props.alert('mobile.rating.alert.later')
          this.props.showLater()
        } else if (buttonIndex === BUTTON_INDEX_RATE) {
          this.props.alert('mobile.rating.alert.rated')
          this.props.dontShowAgain()
        } else {
          this.props.alert('mobile.rating.alert.declined')
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
    if (gaveFeedback) this.props.alert('mobile.rating.alert.feedback')
    this.props.dontShowAgain()
  }

  render() {
    return this.state.screen === SCREEN_ENJOY ? (
      <EnjoyCozy onReply={this.onUserReply} />
    ) : (
      <FeeedbackForm onClose={this.onCloseFeedback} />
    )
  }
}

// sub-components
const EnjoyCozy = (props, context) => {
  const { onReply } = props
  const { t } = context
  return (
    <Modal title={t('mobile.rating.enjoy.title')} withCross={false}>
      <ModalContent>
        <div className={styles['button-block']}>
          <Button theme={'secondary'} onClick={() => onReply(false)}>
            {t('mobile.rating.enjoy.no')}
          </Button>
          <Button onClick={() => onReply(true)}>
            {t('mobile.rating.enjoy.yes')}
          </Button>
        </div>
      </ModalContent>
    </Modal>
  )
}

class FeeedbackForm extends Component {
  state = {
    sending: false
  }

  submitForm = async e => {
    e.preventDefault()
    const { t } = this.context
    const mailData = {
      mode: 'from',
      to: [{ name: 'Support', email: FEEDBACK_EMAIL }],
      subject: t('mobile.rating.email.subject'),
      parts: [{ type: 'text/plain', body: this.textarea.value.toString() }]
    }

    try {
      this.setState({ sending: true })
      await cozy.client.jobs.create('sendmail', mailData)
    } catch (e) {
      // Sending the email failed; this can happen because of insuficient permissions for example. Not a big deal either in this context.
    }

    this.setState({ sending: false })
    this.props.onClose(true)
  }

  registerElement(element) {
    this.textarea = element
  }

  render() {
    const { onClose } = this.props
    const { sending } = this.state
    const { t } = this.context
    return (
      <Modal
        title={t('mobile.rating.feedback.title')}
        dismissAction={() => onClose(false)}
      >
        <ModalContent className={styles['feedback-form']}>
          <form className={'coz-form'} onSubmit={this.submitForm}>
            <textarea
              className={styles['feedback-text']}
              placeholder={t('mobile.rating.email.placeholder')}
              ref={this.registerElement.bind(this)}
            />
            <div className={styles['button-block']}>
              <Button
                theme={'secondary'}
                onClick={e => {
                  e.preventDefault()
                  onClose(false)
                }}
              >
                {t('mobile.rating.feedback.no')}
              </Button>
              <Button busy={sending}>{t('mobile.rating.feedback.yes')}</Button>
            </div>
          </form>
        </ModalContent>
      </Modal>
    )
  }
}

// promptRating is not a component because the native UI is used instead
const promptRating = async ({
  title,
  message,
  yes,
  no,
  later,
  softwareName,
  softwareID
}) => {
  if (window.AppRate) {
    window.AppRate.preferences = {
      displayAppName: softwareName,
      inAppReview: true,
      storeAppURL: {
        ios: softwareID,
        android: `market://details?id=${softwareID}`
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
        onButtonClicked: Promise.resolve
      }
    }

    window.AppRate.promptForRating()
  } else {
    Promise.resolve()
  }
}

// Enhance the base component with HOCs
const withBootDelay = (WrappedComponent, showAfterBoots) => {
  // we want to increment the count once per application boot, *not* per mount/constructor/etc
  let hasIncrementedBootCount = false

  class WithBootDelay extends Component {
    state = {
      bootCount: 0,
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
      const { bootCount, prompted } = this.state
      const visible = prompted === false && bootCount >= showAfterBoots
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
  WithBootDelay.displayName = `WithBootDelay(${WrappedComponent.displayName ||
    WrappedComponent.name ||
    'Component'})`
  return WithBootDelay
}

const mapDispatchToProps = dispatch => ({
  alert: message =>
    dispatch({
      type: ALERT_RATING,
      alert: { message }
    })
})

const ConnectedRatingModal = connect(null, mapDispatchToProps)(RatingModal)
const DelayedRatingModal = withBootDelay(
  ConnectedRatingModal,
  PROMPT_AFTER_BOOTS
)
const PersistentRatingModal = withPersistentState(
  DelayedRatingModal,
  'DelayedRatingModal'
)

export default PersistentRatingModal
