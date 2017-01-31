import styles from '../styles/actionmenu'

import React from 'react'
import { translate } from '../lib/I18n'
import { Item } from 'react-bosonic/lib/Menu'

const FileActionMenu = ({ t }) => (
  <div className={styles['fil-actionmenu-wrapper']}>
    <div className={styles['fil-actionmenu-backdrop']} />
    <div className={styles['fil-actionmenu']}>
      <Item>
        <a className={styles['fil-action-openwith']}>
          {t('mobile.actionmenu.open_with')}
        </a>
      </Item>
      <Item>
        <a className={styles['fil-action-download']}>
          {t('mobile.actionmenu.download')}
        </a>
      </Item>
    </div>
  </div>
)

export default translate()(FileActionMenu)
