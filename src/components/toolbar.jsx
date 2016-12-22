import styles from '../styles/toolbar'

import React from 'react'
import { translate } from '../plugins/preact-polyglot'

const Toolbar = ({ t }) => (
  <div class={ styles['fil-content-toolbar'] } role="toolbar">
    <button role="button" class="coz-btn coz-btn--regular coz-btn--upload">{ t('Upload') }</button>
    <button role="button" class="coz-btn coz-btn--more"><span class="coz-hidden">More</span></button>
  </div>
)

export default translate()(Toolbar)
