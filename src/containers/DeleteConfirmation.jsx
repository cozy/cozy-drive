import styles from '../styles/deleteconfirmation'
import classNames from 'classnames'

import React from 'react'
import { connect } from 'react-redux'
import { translate } from '../lib/I18n'

import { hideDeleteConfirmation, toggleFileSelection, trashFile } from '../actions'

const DeleteConfirmation = ({ t, selected, selectionContainsDirs, selectionContainsFiles, onConfirm, onDismiss }) => {
  const translationKeyForWhatToDelete = selectionContainsDirs && selectionContainsFiles ? 'title_what_mixed' : (selectionContainsDirs ? 'title_what_folder' : 'title_what_file')
  const deleteConfirmationTitle = t('deleteconfirmation.title', {what: t(`deleteconfirmation.${translationKeyForWhatToDelete}`, selected.length)})

  // if it's a mixed selection, we want to use singular, regardless of the actual item count
  const textPluralizationCounter = selectionContainsDirs && selectionContainsFiles ? 1 : selected.length

  const deleteConfirmationTexts = ['trash', 'restore', 'shared'].map(type => (
    <p className={classNames(styles['fil-deleteconfirmation-text'], styles[`icon-${type}`])}>
      {t(`deleteconfirmation.${type}`, textPluralizationCounter)}
    </p>
  ))

  return (<div className={styles['fil-deleteconfirmation']}>
    <div className={styles['coz-overlay']}>
      <div className={styles['coz-modal']}>
        <h2 className={styles['coz-modal-title']}>
          {deleteConfirmationTitle}
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
  let selected = state.ui.selected
  let selectedItems = state.files.filter(file => selected.indexOf(file.id) > -1)
  let selectionContainsDirs = selectedItems.find(f => f.type === 'directory')
  let selectionContainsFiles = selectedItems.find(f => f.type !== 'directory')

  return {
    selected: selected,
    selectionContainsDirs: selectionContainsDirs,
    selectionContainsFiles: selectionContainsFiles
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
