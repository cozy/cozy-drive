import React, { Component } from 'react'
import Breadcrumb from './Breadcrumb'

export default class Wizard extends Component {
  constructor(props) {
    super(props)

    this.nextStep = this.nextStep.bind(this)
    this.previousStep = this.previousStep.bind(this)

    this.state = {
      step: 0
    }
  }

  nextStep() {
    if (this.state.step >= this.props.steps.length - 1) {
      this.props.onComplete()
      return
    }
    this.setState({ step: this.state.step + 1 })
  }

  previousStep() {
    if (this.state.step === 0) return
    this.setState({ step: this.state.step - 1 })
  }

  render() {
    const Step = this.props.steps[this.state.step]
    const Breadcrumbs = (
      <Breadcrumb
        currentStep={this.state.step + 1}
        totalSteps={this.props.steps.length}
      />
    )

    return (
      <Step
        nextStep={this.nextStep}
        previousStep={this.previousStep}
        breadcrumbs={Breadcrumbs}
        {...this.props}
      />
    )
  }
}
