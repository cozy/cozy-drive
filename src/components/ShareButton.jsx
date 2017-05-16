import React from 'react'
import { translate } from '../lib/I18n'

import classNames from 'classnames'

export const ShareButton = ({ t, label }) => (
  <button
    role='button'
    className={classNames('coz-btn', 'coz-btn--secondary', 'coz-btn--share')}
  >
    {label}
  </button>
)

export default translate()(ShareButton)
