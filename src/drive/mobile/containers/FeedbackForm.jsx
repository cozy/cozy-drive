/* global cozy */
import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Modal, { ModalContent } from 'cozy-ui/react/Modal'
import { Button } from 'cozy-ui/react/Button'

import styles from '../styles/feedback'

const FEEDBACK_EMAIL = 'contact@cozycloud.cc'

class FeedbackForm extends Component {
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
FeedbackForm.propTypes = {
  onClose: PropTypes.func.isRequired
}

export default FeedbackForm
