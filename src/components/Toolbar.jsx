import styles from '../styles/toolbar'

import React from 'react'
import { translate } from '../lib/I18n'

const Toolbar = ({ t }) => (
  <div class={styles['fil-content-toolbar']} role='toolbar'>
    <button role='button' class='coz-btn coz-btn--regular coz-btn--upload'>{ t('toolbar.item_upload') }</button>
    <button role='button' class='coz-btn coz-btn--more'><span class='coz-hidden'>{ t('toolbar.item_more') }</span></button>
  </div>
)

export default translate()(Toolbar)
