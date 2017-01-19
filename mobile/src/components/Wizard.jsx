import React from 'react'

export default class Wizard extends React.Component {
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
    return <Step nextStep={this.nextStep} {...this.props} />
  }
}
