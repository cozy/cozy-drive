import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Welcome from './steps/Welcome'
import SelectServer from './steps/SelectServer'

const STEP_WELCOME = 'STEP_WELCOME'
const STEP_EXISTING_SERVER = 'STEP_EXISTING_SERVER'

class Authentication extends Component {
  constructor(props) {
    super(props)

    this.state = {
      currentStepIndex: 0,
      generalError: null,
      fetching: false
    }

    this.steps = [STEP_WELCOME]
  }

  nextStep() {
    this.setState(prevState => ({
      currentStepIndex: ++prevState.currentStepIndex
    }))
  }

  onAbort() {
    this.setState({ currentStepIndex: 0 })
  }

  setupSteps() {
    this.steps = [STEP_WELCOME, STEP_EXISTING_SERVER]
    this.nextStep()
  }

  connectToServer = async url => {
    const { onComplete, onException, router } = this.props
    try {
      this.setState({ generalError: null, fetching: true })
      const cozyClient = this.context.client
      const { client, token } = await cozyClient.register(url)
      onComplete({
        url,
        token,
        clientInfo: client,
        router: router
      })
    } catch (err) {
      this.setState({ generalError: err })
      onException(err, {
        tentativeUrl: url,
        onboardingStep: 'connecting to server'
      })
    } finally {
      this.setState({ fetching: false })
    }
  }

  render() {
    const { onException } = this.props
    const { currentStepIndex, generalError, fetching } = this.state
    const currentStep = this.steps[currentStepIndex]

    switch (currentStep) {
      case STEP_WELCOME:
        return (
          <Welcome
            selectServer={() => this.setupSteps()}
            register={() => this.setupSteps()}
            allowRegistration={false}
          />
        )
      case STEP_EXISTING_SERVER:
        return (
          <SelectServer
            nextStep={this.connectToServer}
            previousStep={() => this.onAbort()}
            externalError={generalError}
            fetching={fetching}
            onException={onException}
          />
        )
      default:
        return null
    }
  }
}

Authentication.propTypes = {
  onComplete: PropTypes.func.isRequired,
  onException: PropTypes.func.isRequired,
  router: PropTypes.object
}

export default Authentication
