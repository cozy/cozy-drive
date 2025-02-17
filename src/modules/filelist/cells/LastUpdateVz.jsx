import PropTypes from 'prop-types'
import React from 'react'

const LastUpdateVz = ({ date, formatted }) => {
  return <time dateTime={date}>{formatted}</time>
}

LastUpdateVz.propTypes = {
  date: PropTypes.string,
  formatted: PropTypes.string
}

export default React.memo(LastUpdateVz)
