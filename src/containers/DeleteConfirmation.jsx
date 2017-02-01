import styles from '../styles/deleteconfirmation'
import classNames from 'classnames'

import React from 'react'
import { connect } from 'react-redux'
import { translate } from '../lib/I18n'

import { hideDeleteConfirmation, toggleFileSelection, trashFile } from '../actions'

const DeleteConfirmation = ({ t, selected, onConfirm, onDismiss }) => (
  <div className={styles['fil-deleteconfirmation']}>
    <div className={styles['coz-overlay']}>
      <div className={styles['coz-modal']}>
        <h2 className={styles['coz-modal-title']}>
          {t('deleteconfirmation.title')}
        </h2>
        <button
          className={classNames('coz-btn', 'coz-btn--close', styles['coz-modal-close'])}
          onClick={() => onDismiss(selected)}
          >
          <span className='coz-hidden'>{t('deleteconfirmation.close')}</span>
        </button>
        <p className={classNames(styles['fil-deleteconfirmation-text'], styles['icon-trash'])}>
          {t('deleteconfirmation.trash')}
        </p>
        <p className={classNames(styles['fil-deleteconfirmation-text'], styles['icon-restore'])}>
          {t('deleteconfirmation.restore')}
        </p>
        <p className={classNames(styles['fil-deleteconfirmation-text'], styles['icon-shared'])}>
          {t('deleteconfirmation.shared')}
        </p>
        <div className={styles['fil-deleteconfirmation-buttons']}>
          <button className={styles['secondary']} onClick={() => onDismiss(selected)}>
            {t('deleteconfirmation.cancel')}
          </button>
          <button className={styles['danger']} onClick={() => onConfirm(selected)}>
            {t('deleteconfirmation.delete')}
          </button>
        </div>
      </div>
    </div>
  </div>
)

const mapStateToProps = (state, ownProps) => ({
  selected: state.ui.selected
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  onDismiss: (selected) => {
    dispatch(hideDeleteConfirmation())
    selected.forEach(item => dispatch(toggleFileSelection(item, true)))
  },
  onConfirm: (selected) => {
    selected.forEach(item => {
      dispatch(trashFile(item))
      dispatch(toggleFileSelection(item, true))
    })
    dispatch(hideDeleteConfirmation())
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(translate()(DeleteConfirmation))
