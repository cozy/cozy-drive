import React, { Component } from 'react'

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
    try {
      this.setState({ generalError: null, fetching: true })
      const cozyClient = this.context.client
      const { client, token } = await cozyClient.register(url)
      this.props.onComplete({
        url,
        clientInfo: client,
        token,
        router: this.props.router
      })
    } catch (err) {
      this.setState({ generalError: err })
    } finally {
      this.setState({ fetching: false })
    }
  }

  render() {
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
          />
        )
      default:
        return null
    }
  }
}

export default Authentication
