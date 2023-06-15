import React, { Component } from 'react'
import PropTypes from 'prop-types'

const KEYCODE_ENTER = 13
const KEYCODE_ESC = 27

class EditableAlbumName extends Component {
  constructor(props) {
    super(props)
    this.ignoreBlurEvent = false // we'll ignore blur events if they are triggered by pressing enter or escape, to prevent `onEdit` from firing twice
    this.inputElement = null
  }

  componentDidMount() {
    if (this.inputElement !== null) {
      this.inputElement.focus()
      this.inputElement.select()
    }
  }

  handleBlur = e => {
    if (!this.ignoreBlurEvent && this.props.onEdit)
      this.props.onEdit(
        e.target.value.trim() !== '' ? e.target.value : this.props.albumName
      )
  }

  handleKeyDown = e => {
    if (e.keyCode === KEYCODE_ENTER && this.props.onEdit) {
      this.ignoreBlurEvent = true
      this.props.onEdit(e.target.value)
    } else if (e.keyCode === KEYCODE_ESC && this.props.onEdit) {
      this.ignoreBlurEvent = true
      this.props.onEdit(this.props.albumName)
    }
  }

  render() {
    const { albumName } = this.props
    return (
      <input
        type="text"
        defaultValue={albumName}
        onKeyDown={this.handleKeyDown}
        onBlur={this.handleBlur}
        ref={elem => {
          this.inputElement = elem
        }}
      />
    )
  }
}

EditableAlbumName.propTypes = {
  albumName: PropTypes.string,
  onEdit: PropTypes.func.isRequired
}

export default EditableAlbumName
