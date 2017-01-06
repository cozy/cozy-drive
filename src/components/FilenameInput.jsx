import React, { Component } from 'react'

const ENTER_KEY = 'Enter'

export default class FilenameInput extends Component {
  constructor (props) {
    super(props)
    this.state = {
      value: name || ''
    }
  }

  componentDidMount () {
    this.textInput.focus()
  }

  handleKeyPress (e) {
    if (e.key === ENTER_KEY) {
      this.submit()
      this.setState({ value: '' })
    }
  }

  handleChange (e) {
    this.setState({ value: e.target.value })
  }

  submit () {
    this.props.onSubmit(this.state.value)
  }

  render ({ isUpdating }, { value }) {
    return (
      <input
        type='text'
        value={value}
        ref={(input) => { this.textInput = input }}
        disabled={isUpdating}
        onChange={e => this.handleChange(e)}
        onKeyPress={e => this.handleKeyPress(e)}
      />
    )
  }
}
