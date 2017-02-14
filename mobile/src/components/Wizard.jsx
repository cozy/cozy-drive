import React, { Component } from 'react'

export default class Wizard extends Component {
  constructor (props) {
    super(props)

    this.nextStep = this.nextStep.bind(this)

    this.state = {
      step: 0
    }
  }

  nextStep () {
    this.setState({ step: this.state.step + 1 })
  }

  render () {
    const Step = this.props.steps[this.state.step]
    if (!Step) {
      if (location.state && location.state.nextPathname) {
        this.props.router.replace(location.state.nextPathname)
      } else {
        this.props.router.replace('/')
      }
    }
    return <Step nextStep={this.nextStep} {...this.props} />
  }
}
