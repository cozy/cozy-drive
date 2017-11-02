import styles from '../styles/intentbutton'

/* global cozy */
import React from 'react'
import classNames from 'classnames'

import Modal from 'cozy-ui/react/Modal'

class IntentButton extends React.Component {
  state = {
    modalIsOpen: false
  }

  openModal = () => {
    this.setState({
      modalIsOpen: true
    })
  }

  closeModal = () => {
    this.setState({
      modalIsOpen: false
    })
  }

  render() {
    const { className, data, action, docType, children } = this.props
    const { modalIsOpen } = this.state
    return (
      <span className={classNames(styles['intentButton'])}>
        {modalIsOpen && (
          <Modal secondaryAction={() => this.closeModal()}>
            <Intent
              action={action}
              docType={docType}
              data={data}
              closeModal={this.closeModal}
            />
          </Modal>
        )}
        <button className={className} onClick={() => this.openModal()}>
          {children}
        </button>
      </span>
    )
  }
}

class Intent extends React.Component {
  componentDidMount() {
    const { action, docType, data, closeModal } = this.props
    cozy.client.intents
      .create(action, docType, {
        ...data,
        exposeIntentFrameRemoval: true
      })
      .start(this.intentViewer)
      .then(() => {
        closeModal()
      })
  }

  render() {
    return (
      <div
        id="intentViewer"
        className={classNames(styles['intentViewer'])}
        ref={intentViewer => (this.intentViewer = intentViewer)}
      />
    )
  }
}

export { IntentButton }
export default Intent
