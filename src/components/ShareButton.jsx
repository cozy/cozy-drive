import React from 'react'

import classNames from 'classnames'

export const ShareButton = ({ label, onClick }) => (
  <button
    role='button'
    className={classNames('coz-btn', 'coz-btn--secondary', 'coz-btn--share')}
    onClick={() => onClick()}
  >
    {label}
  </button>
)

export default ShareButton
