import React, { Component } from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'

import styles from '../styles/table'
import { renameFile } from '../actions'

const ENTER_KEY = 'Enter'

class FilenameInput extends Component {
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
    this.props.onSubmit(this.textInput.value)
  }

  render ({ name }) {
    return (
      <input
        type='text'
        defaultValue={name}
        ref={(input) => { this.textInput = input }}
        onKeyPress={this.handleKeyPress}
        onBlur={() => this.submit()}
      />
    )
  }
}

const FilenameCell = ({ renaming, index, attributes, onSubmit }) => {
  return (
    <td class={classNames(styles['fil-content-file'], styles['fil-file-folder'])}>
      {renaming === index
        ? <FilenameInput name={attributes.name} onSubmit={onSubmit} />
        : attributes.name}
    </td>
  )
}

const mapStateToProps = (state, ownProps) => ({
  renaming: state.ui.renaming
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  onSubmit: (newName) => {
    dispatch(renameFile(ownProps.index, newName, ownProps.attributes))
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FilenameCell)
