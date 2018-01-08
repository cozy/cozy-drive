/* global cozy */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Modal from 'cozy-ui/react/Modal'
import { translate } from 'cozy-ui/react/I18n'

class Revoked extends Component {
  logout() {
    this.props.onLogout()
  }

  async logBackIn() {
    const url = cozy.client._url
    cozy.client._storage.clear()
    try {
      const cozyClient = this.context.client
      const { client, token } = await cozyClient.register(url)
      this.props.onLogBackIn({
        url,
        clientInfo: client,
        token,
        router: this.props.router
      })
    } catch (_) {}
  }

  render({ t }) {
    return (
      <Modal
        title={t('mobile.revoked.title')}
        description={t('mobile.revoked.description')}
        secondaryText={t('mobile.revoked.logout')}
        secondaryAction={() => {
          this.logout()
        }}
        primaryText={t('mobile.revoked.loginagain')}
        primaryAction={() => {
          this.logBackIn()
        }}
        closable={false}
      />
    )
  }
}

Revoked.propTypes = {
  onLogout: PropTypes.func.isRequired,
  onLogBackIn: PropTypes.func.isRequired,
  router: PropTypes.object.isRequired
}

export default translate()(Revoked)
