import styles from './empty-drive'

import React from 'react'
import { translate } from 'cozy-ui/react/I18n'

const Empty = translate()(({ t, canUpload }) => {
  return (
    <div className={styles['fil-empty']}>
      <h2>{t('empty.title')}</h2>
      {canUpload && <p>{t('empty.text')}</p>}
    </div>
  )
})

export default Empty

const EmptyTrash = translate()(({ t }) => {
  return (
    <div className={styles['fil-trash-empty']}>
      <h2>{t('empty.trash.title')}</h2>
      <p>{t('empty.trash.text')}</p>
    </div>
  )
})

export { EmptyTrash }
