import styles from '../styles/deleteconfirmation'
import classNames from 'classnames'

import React from 'react'
import { connect } from 'react-redux'
import { translate } from '../lib/I18n'

import { hideDeleteConfirmation, toggleFileSelection, trashFile } from '../actions'

const DeleteConfirmation = ({ t, selected, onConfirm, onDismiss }) => {
  const deleteConfirmationTexts = ['trash', 'restore', 'shared'].map(type => (
    <p className={classNames(styles['fil-deleteconfirmation-text'], styles[`icon-${type}`])}>
      {t(`deleteconfirmation.${type}`, selected.length)}
    </p>
  ))

  return (<div className={styles['fil-deleteconfirmation']}>
    <div className={styles['coz-overlay']}>
      <div className={styles['coz-modal']}>
        <h2 className={styles['coz-modal-title']}>
          {t('deleteconfirmation.title', selected.length)}
        </h2>
        <button
          className={classNames('coz-btn', 'coz-btn--close', styles['coz-modal-close'])}
          onClick={() => onDismiss(selected)}
          >
          <span className='coz-hidden'>{t('deleteconfirmation.cancel')}</span>
        </button>
        {deleteConfirmationTexts}
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
  </div>)
}

const mapStateToProps = (state, ownProps) => {
  return {
    selected: state.ui.selected
  }
}

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
