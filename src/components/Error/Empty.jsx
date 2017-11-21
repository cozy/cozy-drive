import styles from './empty.styl'

import React from 'react'
import { translate } from 'cozy-ui/react/I18n'

const Empty = translate()(({ t, type, canUpload, emptyType }) => {
  return (
    <div className={styles[`c-empty-${type}`]}>
      {emptyType ? (
        <div>
          <h2>{t(`empty.${emptyType}_title`)}</h2>
          <p>{t(`empty.${emptyType}_text`)}</p>
        </div>
      ) : (
        <h2>{t('empty.title')}</h2>
      )}
      {canUpload && <p>{t('empty.text')}</p>}
    </div>
  )
})

export default Empty

export const EmptyDrive = props => <Empty type="drive" {...props} />

export const EmptyPhotos = props => <Empty type="photos" {...props} />

export const EmptyTrash = translate()(({ t }) => {
  return (
    <div className={styles['c-trash-empty']}>
      <h2>{t('empty.trash.title')}</h2>
      <p>{t('empty.trash.text')}</p>
    </div>
  )
})
