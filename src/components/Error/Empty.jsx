import styles from './empty.styl'

import React from 'react'
import { translate } from 'cozy-ui/react/I18n'

const Empty = translate()(({ t, type, canUpload, emptyType }) => {
  return (
    <div className={styles[`c-empty-${type}`]}>
      {emptyType ? (
        <h2>{t(`empty.${emptyType}_title`)}</h2>
      ) : (
        <h2>{t('empty.title')}</h2>
      )}
      {emptyType && <p>{t(`empty.${emptyType}_text`)}</p>}
      {canUpload && <p>{t('empty.text')}</p>}
    </div>
  )
})

export default Empty

const EmptyTrash = translate()(({ t }) => {
  return (
    <div className={styles['c-trash-empty']}>
      <h2>{t('empty.trash.title')}</h2>
      <p>{t('empty.trash.text')}</p>
    </div>
  )
})

export { EmptyTrash }
