import styles from '../styles/deleteconfirmation'
import classNames from 'classnames'

import React from 'react'
import { connect } from 'react-redux'
import { translate } from '../lib/I18n'
import Modal from 'cozy-ui/react/Modal'

import { getActionableFiles } from '../reducers'
import { hideDeleteConfirmation, toggleFileSelection, hideFileActionMenu, trashFile } from '../actions'

const DeleteConfirmation = ({ t, files, onConfirm, onDismiss, dropSelection }) => {
  const deleteConfirmationTexts = ['trash', 'restore', 'shared'].map(type => (
    <p className={classNames(styles['fil-deleteconfirmation-text'], styles[`icon-${type}`])}>
      {t(`deleteconfirmation.${type}`, files.length)}
    </p>
  ))

  return (<Modal
    title={t('deleteconfirmation.title', files.length)}
    description={deleteConfirmationTexts}
    cancelText={t('deleteconfirmation.cancel')}
    cancelAction={() => onDismiss(files, dropSelection)}
    validateType='danger'
    validateText={t('deleteconfirmation.delete')}
    validateAction={() => onConfirm(files, dropSelection)}
   />)
}

const mapStateToProps = (state, ownProps) => {
  return {
    files: getActionableFiles(state),
    dropSelection: state.ui.selected.length > 0
  }
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  onDismiss: (files, dropSelection) => {
    if (dropSelection) files.forEach(item => dispatch(toggleFileSelection(item.id, true)))
    dispatch(hideDeleteConfirmation())
    dispatch(hideFileActionMenu())
  },
  onConfirm: (files, dropSelection) => {
    files.forEach(item => {
      dispatch(trashFile(item.id))
      if (dropSelection) dispatch(toggleFileSelection(item.id, true))
    })
    dispatch(hideDeleteConfirmation())
    dispatch(hideFileActionMenu())
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(translate()(DeleteConfirmation))
