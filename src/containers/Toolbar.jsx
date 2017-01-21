import styles from '../styles/toolbar'

import React from 'react'
import { translate } from '../lib/I18n'

import UploadButton from './UploadButton'

const Toolbar = ({ t }) => (
  <div className={styles['pho-content-toolbar']} role='toolbar'>
    <UploadButton t={t} />
  </div>
)

export default translate()(Toolbar)
