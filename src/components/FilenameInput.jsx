import React, { Component } from 'react'

import styles from '../styles/filenameinput'
import { translate } from '../lib/I18n'

const ENTER_KEY = 13
const ESC_KEY   = 27

const valueIsEmpty = value => value.toString() === ''

class FilenameInput extends Component {
  constructor (props) {
    super(props)
    this.state = {
      value: props.name || '',
      hasBeenSubmitedOrAborted: false
    }
  }

  componentDidMount () {
    this.textInput.focus()
  }

  handleKeyDown (e) {
    if (e.keyCode === ENTER_KEY && !valueIsEmpty(this.state.value)) {
      this.setState({ hasBeenSubmitedOrAborted: true })
      this.submit()
    }
    else if (e.keyCode === ESC_KEY) {
      this.setState({ hasBeenSubmitedOrAborted: true })
      this.abort()
    }
  }

  handleChange (e) {
    this.setState({ value: e.target.value })
  }

  handleBlur () {
    //On top of "normal" blurs, the event happens all the time after a submit or an abort, because this component is removed from the DOM while having the focus.
    //we want to do things only on "normal" blurs, *not* after a submit/abort
    if (!this.state.hasBeenSubmitedOrAborted) {
      //when it's a regular blur, we want to abort, except is the value is non-empty
      if (valueIsEmpty(this.state.value)) this.abort(true)
      else this.submit()
    }
  }

  submit () {
    this.props.onSubmit(this.state.value)
  }

  abort (accidental) {
    this.props.onAbort(accidental)
  }

  render ({ t, isUpdating }, { value }) {

    return (
      <div className={styles['fil-file-name-input']}>
        <input
          type='text'
          value={value}
          ref={(input) => { this.textInput = input }}
          disabled={isUpdating}
          onChange={e => this.handleChange(e)}
          onBlur={() => this.handleBlur()}
          onKeyDown={e => this.handleKeyDown(e)}
          className={this.props.error ? styles['error'] : null}
        />
        {this.props.error && <div className={styles['coz-errors']}>
          {t(this.props.error.message, {folderName: this.props.name})}
        </div>}
      </div>
    )
  }
}

export default translate()(FilenameInput)
