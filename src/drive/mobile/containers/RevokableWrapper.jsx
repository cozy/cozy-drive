import React, { Component } from 'react'
import { connect } from 'react-redux'
import Modal from 'cozy-ui/react/Modal'
import { translate } from 'cozy-ui/react/I18n'
import { resetClient } from '../lib/cozy-helper'
import { unrevokeClient } from '../actions/authorization'
import { registerDevice } from '../actions/settings'

class RevokableWrapper extends Component {
  logout() {
    resetClient(this.context.client)
    this.props.unrevokeClient()
    this.props.router.replace({
      pathname: '/onboarding',
      state: { nextPathname: this.props.location.pathname }
    })
  }

  loginagain() {
    this.props.registerDevice(this.context.client)
  }

  render() {
    const { children, t } = this.props
    if (this.props.revoked) {
      return (
        <div>
          <Modal
            title={t('mobile.revoked.title')}
            description={t('mobile.revoked.description')}
            secondaryText={t('mobile.revoked.logout')}
            secondaryAction={() => {
              this.logout()
            }}
            primaryText={t('mobile.revoked.loginagain')}
            primaryAction={() => {
              this.loginagain()
            }}
            withCross={false}
          />
          {children}
        </div>
      )
    } else {
      return children
    }
  }
}

const mapDispatchToProps = dispatch => ({
  unrevokeClient: () => dispatch(unrevokeClient()),
  registerDevice: client =>
    dispatch(registerDevice(client)).then(() => {
      dispatch(unrevokeClient())
    })
})

const mapStateToProps = state => ({
  revoked: state.mobile.authorization.revoked
})

export default connect(mapStateToProps, mapDispatchToProps)(
  translate()(RevokableWrapper)
)
