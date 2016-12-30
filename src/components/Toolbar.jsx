import styles from '../styles/toolbar'

import React from 'react'
import { translate } from '../plugins/preact-polyglot'

const Toolbar = ({ t }) => (
  <div className={styles['fil-content-toolbar']} role='toolbar'>
    <button role='button' className='coz-btn coz-btn--regular coz-btn--upload'>{ t('toolbar.item_upload') }</button>
    <button role='button' className='coz-btn coz-btn--more'><span class='coz-hidden'>{ t('toolbar.item_more') }</span></button>
  </div>
)

export default translate()(Toolbar)
