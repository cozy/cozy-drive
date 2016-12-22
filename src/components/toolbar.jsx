import styles from '../styles/toolbar'

import React from 'react'
import { translate } from '../plugins/preact-polyglot'
import classNames from 'classnames'

const Toolbar = ({ t }) => (
  <div class={ styles['fil-content-toolbar'] } role="toolbar">
    <button role="button" class={ classNames(styles['coz-btn'], styles['coz-btn--regular'], styles['coz-btn--upload']) }>{ t('Upload') }</button>
    <button role="button" class={ classNames(styles['coz-btn'], styles['coz-btn--more']) }><span class={ classNames(styles['coz-hidden']) }>More</span></button>
  </div>
)

export default translate()(Toolbar)
