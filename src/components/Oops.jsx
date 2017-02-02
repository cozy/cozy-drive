import styles from '../styles/oops'

import React from 'react'
import { translate } from '../lib/I18n'

const reload = () => {
  window.location.reload()
}

const Oops = ({ t }) => (
  <div class={styles['fil-oops']}>
    <h2>{ t('error.open_folder') }</h2>
    <p>
      <button
        role='button'
        className='coz-btn coz-btn--regular'
        onClick={reload}
      >
        { t('error.button.reload') }
      </button>
    </p>
  </div>
)

export default translate()(Oops)
