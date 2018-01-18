import styles from './empty.styl'

import React from 'react'
import { translate } from 'cozy-ui/react/I18n'

const Empty = translate()(({ t, type, canUpload, localeKey }) => {
  return (
    <div className={styles[`c-empty-${type}`]}>
      {localeKey ? (
        <div>
          <h2>{t(`empty.${localeKey}_title`)}</h2>
          <p>{t(`empty.${localeKey}_text`)}</p>
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
    <div role="main" className={styles['c-trash-empty']}>
      <h2>{t('empty.trash.title')}</h2>
      <p>{t('empty.trash.text')}</p>
    </div>
  )
})
