import React, { useRef, useEffect, useState } from 'react'
import PropTypes from 'prop-types'

const KEYCODE_ENTER = 13
const KEYCODE_ESC = 27

const EditableAlbumName = ({ onEdit, albumName }) => {
  // we'll ignore blur events if they are triggered by pressing enter or escape, to prevent `onEdit` from firing twice
  const [ignoreBlurEvent, setIgnoreBlurEvent] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => {
    inputRef.current.focus()
    inputRef.current.select()
  }, [])

  const handleBlur = e => {
    if (!ignoreBlurEvent && onEdit) {
      onEdit(e.target.value.trim() !== '' ? e.target.value : albumName)
    }
  }

  const handleKeyDown = e => {
    if (e.keyCode === KEYCODE_ENTER && onEdit) {
      setIgnoreBlurEvent(true)
      onEdit(e.target.value)
    } else if (e.keyCode === KEYCODE_ESC && onEdit) {
      setIgnoreBlurEvent(true)
      onEdit(albumName)
    }
  }

  return (
    <input
      type="text"
      defaultValue={albumName}
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
      ref={inputRef}
    />
  )
}

EditableAlbumName.propTypes = {
  albumName: PropTypes.string,
  onEdit: PropTypes.func.isRequired
}

export default EditableAlbumName
