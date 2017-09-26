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
    this.setState({ step: this.state.step + 1 })
  }

  previousStep() {
    if (this.state.step === 0) return
    this.setState({ step: this.state.step - 1 })
  }

  render() {
    const Step = this.props.steps.concat(this.props.breadcrumbSteps)[
      this.state.step
    ]
    if (!Step) {
      if (this.props.location.state && this.props.location.state.nextPathname) {
        this.props.router.replace(this.props.location.state.nextPathname)
      } else {
        this.props.router.replace('/')
      }
    }
    const Breadcrumbs =
      this.state.step < this.props.steps.length ? null : (
        <Breadcrumb
          currentStep={this.state.step + 1 - this.props.steps.length}
          totalSteps={this.props.breadcrumbSteps.length}
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
