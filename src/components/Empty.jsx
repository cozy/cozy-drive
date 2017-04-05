import styles from '../styles/empty'

import React from 'react'
import { translate } from '../lib/I18n'

const Empty = translate()(({ t, canUpload }) => {
  return (
    <div class={styles['fil-empty']}>
      <h2>{ t('empty.title') }</h2>
      {canUpload && <p>{ t('empty.text')}</p>}
    </div>
  )
})

export default Empty

const EmptyTrash = translate()(({ t }) => {
  return (
    <div class={styles['fil-trash-empty']}>
      <h2>{ t('empty.trash.title') }</h2>
      <p>{ t('empty.trash.text')}</p>
    </div>
  )
})

export { EmptyTrash }
