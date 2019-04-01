/* global cozy __APP_VERSION__ */
import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Modal, { ModalContent } from 'cozy-ui/react/Modal'
import { Button } from 'cozy-ui/react/Button'

import styles from '../styles'
import { logInfo } from 'drive/lib/reporter'

const FEEDBACK_EMAIL = 'contact@cozycloud.cc'

class FeedbackForm extends Component {
  state = {
    sending: false
  }
  static contextTypes = {
    t: PropTypes.func.isRequired
  }

  submitForm = async e => {
    e.preventDefault()
    const { t } = this.context
    const envInfo =
      `Cozy Drive Mobile v${__APP_VERSION__}` +
      `\nOn ${navigator.platform}` +
      `\nFrom ${navigator.vendor}` +
      `\n${navigator.userAgent}`

    const mailContent =
      this.textarea.value.toString() + '\n_______________\n' + envInfo

    const mailData = {
      mode: 'from',
      to: [{ name: 'Support', email: FEEDBACK_EMAIL }],
      subject: t('mobile.rating.email.subject'),
      parts: [{ type: 'text/plain', body: mailContent }]
    }

    try {
      this.setState({ sending: true })
      logInfo(
        `feedback logs: ${this.textarea.value.toString().substr(0, 40)}`,
        cozy.client._url
      )
      await cozy.client.jobs.create('sendmail', mailData)
    } catch (e) {
      // Sending the email failed; this can happen because of insuficient permissions for example. Not a big deal either in this context.
    }
    this.clearInput()
    this.setState({ sending: false })
    this.props.onClose(true)
  }

  registerElement(element) {
    this.textarea = element
  }
  clearInput() {
    this.textarea.value = ''
  }
  render() {
    const { onClose } = this.props
    const { sending } = this.state
    const { t } = this.context
    return (
      <Modal
        title={t('mobile.rating.feedback.title')}
        dismissAction={() => {
          this.clearInput()
          onClose(false)
        }}
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
                  this.clearInput()
                  onClose(false)
                }}
                label={t('mobile.rating.feedback.no')}
              />
              <Button busy={sending} label={t('mobile.rating.feedback.yes')} />
            </div>
          </form>
        </ModalContent>
      </Modal>
    )
  }
}
FeedbackForm.propTypes = {
  onClose: PropTypes.func.isRequired
}

export default FeedbackForm
