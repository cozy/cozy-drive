/* global __TARGET__ */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import snarkdown from 'snarkdown'
import PropTypes from 'prop-types'

import Icon from 'cozy-ui/transpiled/react/Icon'
import Button from 'cozy-ui/transpiled/react/Button'
import Alerter from 'cozy-ui/transpiled/react/Alerter'
import { translate } from 'cozy-ui/transpiled/react'
import Modal from 'cozy-ui/transpiled/react/Modal'

import tosIcon from 'drive/mobile/assets/icons/icon-tos.svg'
import { unlink, getClientSettings } from './duck'

import styles from './styles.styl'

const TosUpdatedModal = translate()(({ t, newTosLink, onAccept, onRefuse }) => {
  const updatedDetails = snarkdown(
    t('TOS.updated.detail', { link: newTosLink })
  )
  return (
    <Modal closable={false}>
      <Modal.ModalHeader />
      <Modal.ModalDescription className={styles['tosupdated']}>
        <Icon icon={tosIcon} width={96} height={96} />
        <h2 className={styles['tosupdated-title']}>{t('TOS.updated.title')}</h2>
        <div
          className={styles['tosupdated-desc']}
          dangerouslySetInnerHTML={{ __html: updatedDetails }}
        />
        <Button
          extension="full"
          label={t('TOS.updated.cta')}
          onClick={onAccept}
        />
        <Button
          subtle
          size="small"
          extension="full"
          style={{ marginTop: '1.5rem' }}
          label={t('TOS.updated.disconnect')}
          onClick={onRefuse}
        />
      </Modal.ModalDescription>
    </Modal>
  )
})

class UserActionRequired extends Component {
  static contextTypes = {
    client: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired
  }

  state = {
    warnings: []
  }

  componentDidMount() {
    if (__TARGET__ === 'mobile') {
      this.checkIfUserActionIsRequired()
      document.addEventListener('resume', this.checkIfUserActionIsRequired)
    }
  }

  componentWillUnmount() {
    if (__TARGET__ === 'mobile') {
      document.removeEventListener('resume', this.checkIfUserActionIsRequired)
    }
  }

  checkIfUserActionIsRequired = async () => {
    const { client, router } = this.context
    try {
      await client.getStackClient().fetch('GET', '/data/')
      const wasBlocked = this.state.warnings.length !== 0
      if (wasBlocked) {
        this.setState({ warnings: [] })
        router.replace('/')
      }
    } catch (e) {
      if (e.status === 402) {
        this.setState({ warnings: e.reason })
      }
    }
  }

  acceptUpdatedTos = async () => {
    const { client, router } = this.context
    try {
      await client.getClient().fetch('PUT', '/settings/instance/sign_tos')
      this.setState({
        warnings: this.state.warnings.filter(w => w.code !== 'tos-updated')
      })
      router.replace('/')
    } catch (e) {
      Alerter.error('TOS.updated.error')
    }
  }

  disconnect = async () => {
    const { client, router } = this.context
    const { unlink, clientSettings } = this.props
    unlink(client, clientSettings)
    router.replace('/onboarding')
  }

  render() {
    const { warnings } = this.state
    if (warnings.length === 0) return null
    const tosUpdated = warnings.find(w => w.code === 'tos-updated')
    if (tosUpdated) {
      return (
        <TosUpdatedModal
          newTosLink={tosUpdated.links.self}
          onAccept={this.acceptUpdatedTos}
          onRefuse={this.disconnect}
        />
      )
    }
  }
}

const mapStateToProps = state => ({
  clientSettings: getClientSettings(state)
})

const mapDispatchToProps = dispatch => ({
  unlink: (client, clientSettings) => dispatch(unlink(client, clientSettings))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserActionRequired)
