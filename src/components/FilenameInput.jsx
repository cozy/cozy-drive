import React, { Component } from 'react'

const ENTER_KEY = 'Enter'

export default class FilenameInput extends Component {
  constructor (props) {
    super(props)
    this.handleKeyPress = this.handleKeyPress.bind(this)
  }

  componentDidMount () {
    this.textInput.focus()
  }

  handleKeyPress (e) {
    if (e.key === ENTER_KEY) {
      this.submit()
    }
  }

  submit () {
    if (this.props.submitting) {
      return
    }
    this.props.onSubmit(this.textInput.value)
  }

  render ({ name, submitting }) {
    return (
      <input
        type='text'
        defaultValue={name || ''}
        ref={(input) => { this.textInput = input }}
        disabled={submitting}
        onKeyPress={this.handleKeyPress}
        onBlur={() => this.submit()}
      />
    )
  }
}
