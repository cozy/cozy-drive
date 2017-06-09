import styles from '../styles/newAlbum'

import React from 'react'
import classNames from 'classnames'

import { translate } from '../lib/I18n'

export const NewAlbum = ({ t }) => {
  return (
    <div className={styles['pho-panel']}>
      <form action='' className={styles['pho-panel-form']}>
        <header className={styles['pho-panel-header']}>
          <div className={styles['pho-panel-wrap']}>
            <label className={styles['coz-form-label']}>{t('Albums.create.panel_form.label')}</label>
            <input type='text' name='' id='' autofocus value={t('Albums.create.panel_form.placeholder')} />
          </div>
        </header>
        <div className={styles['pho-panel-content']}>
          <div className={styles['pho-panel-wrap']}>
            PhotoBoard
          </div>
        </div>
        <footer className={styles['pho-panel-footer']}>
          <div className={styles['pho-panel-wrap']}>
            <div className={styles['pho-panel-controls']}>
              <button className={classNames('coz-btn', 'coz-btn--secondary')}>
                {t('Albums.create.panel_form.cancel')}
              </button>
              <button className={classNames('coz-btn', 'coz-btn--regular')}>
                {t('Albums.create.panel_form.submit')}
              </button>
            </div>
          </div>
        </footer>
      </form>
    </div>
  )
}

export default translate()(NewAlbum)
