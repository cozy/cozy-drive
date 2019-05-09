import React, { Component } from 'react'
import Spinner from 'cozy-ui/react/Spinner'
import styles from 'drive/styles/filenameinput'

const ENTER_KEY = 13
const ESC_KEY = 27

const valueIsEmpty = value => value.toString() === ''

export default class FilenameInput extends Component {
  constructor(props) {
    super(props)
    this.state = {
      value: props.name || '',
      working: false,
      error: false,
      hasBeenSubmitedOrAborted: false
    }
  }

  componentDidMount() {
    this.textInput.focus()
  }

  handleKeyDown(e) {
    if (e.keyCode === ENTER_KEY && !valueIsEmpty(this.state.value)) {
      this.setState({ hasBeenSubmitedOrAborted: true })
      this.submit()
    } else if (e.keyCode === ESC_KEY) {
      this.setState({ hasBeenSubmitedOrAborted: true })
      this.abort()
    }
  }

  handleChange(e) {
    const value = e.target.value
    this.setState({ value })
    this.props.onChange && this.props.onChange(value)
  }

  handleBlur() {
    // On top of "normal" blurs, the event happens all the time after a submit or an abort, because this component is removed from the DOM while having the focus.
    // we want to do things only on "normal" blurs, *not* after a submit/abort
    if (!this.state.hasBeenSubmitedOrAborted) {
      // when it's a regular blur, we want to abort, except is the value is non-empty
      if (valueIsEmpty(this.state.value)) this.abort(true)
      else this.submit()
    }
  }

  submit() {
    this.setState({ working: true, error: false })
    this.props.onSubmit &&
      this.props
        .onSubmit(this.state.value)
        .then(() => this.setState({ working: false }))
        .catch(() =>
          this.setState({
            working: false,
            error: true
          })
        )
  }

  abort(accidental = false) {
    this.props.onAbort && this.props.onAbort(accidental)
  }

  render(props, { value, working, error }) {
    return (
      <div data-test-id="name-input" className={styles['fil-file-name-input']}>
        <input
          type="text"
          value={value}
          ref={input => {
            this.textInput = input
          }}
          disabled={working}
          onChange={e => this.handleChange(e)}
          onBlur={() => this.handleBlur()}
          onKeyDown={e => this.handleKeyDown(e)}
          className={error ? styles['error'] : null}
        />
        {working && <Spinner />}
      </div>
    )
  }
}
