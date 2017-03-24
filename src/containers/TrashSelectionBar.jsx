import styles from '../styles/selectionbar'

import React from 'react'
import { translate } from '../lib/I18n'

const TrashSelectionBar = ({ t, selected, onHide, onRestore }) => (
  <div className={styles['coz-selectionbar']} role='toolbar'>
    <button className={styles['coz-action-restore']} disabled={selected < 1} onClick={() => onRestore(selected)}>{t('selectionbar.restore')}</button>
    <button className={styles['coz-action-close']} onClick={onHide}>{t('selectionbar.close')}</button>
  </div>
)

export default translate()(TrashSelectionBar)
