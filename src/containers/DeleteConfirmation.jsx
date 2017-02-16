import styles from '../styles/deleteconfirmation'
import classNames from 'classnames'

import React from 'react'
import { connect } from 'react-redux'
import { translate } from '../lib/I18n'
import Modal from 'cozy-ui/react/Modal'

import { getActionableFiles } from '../reducers'
import { hideDeleteConfirmation, toggleFileSelection, hideFileActionMenu, trashFile } from '../actions'

const DeleteConfirmation = ({ t, selected, onConfirm, onDismiss, dropSelection }) => {
  const deleteConfirmationTexts = ['trash', 'restore', 'shared'].map(type => (
    <p className={classNames(styles['fil-deleteconfirmation-text'], styles[`icon-${type}`])}>
      {t(`deleteconfirmation.${type}`, selected.length)}
    </p>
  ))

  return (<Modal
    title={t('deleteconfirmation.title', selected.length)}
    description={deleteConfirmationTexts}
    cancelText={t('deleteconfirmation.cancel')}
    cancelAction={() => onDismiss(selected, dropSelection)}
    validateType='danger'
    validateText={t('deleteconfirmation.delete')}
    validateAction={() => onConfirm(selected, dropSelection)}
   />)
}

const mapStateToProps = (state, ownProps) => {
  return {
    selected: getActionableFiles(state),
    dropSelection: state.ui.selected.length > 0
  }
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  onDismiss: (selected, dropSelection) => {
    console.log(selected)
    dispatch(hideDeleteConfirmation())
    if (dropSelection) selected.forEach(item => dispatch(toggleFileSelection(item.id, true)))
  },
  onConfirm: (selected, dropSelection) => {
    selected.forEach(item => {
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
