import styles from '../styles/deleteconfirmation'
import classNames from 'classnames'

import React from 'react'
import { connect } from 'react-redux'
import { translate } from '../lib/I18n'
import Modal from 'cozy-ui/react/Modal'

import { hideDeleteConfirmation, toggleFileSelection, trashFile } from '../actions'

const DeleteConfirmation = ({ t, selected, onConfirm, onDismiss }) => {
  const deleteConfirmationTexts = ['trash', 'restore', 'shared'].map(type => (
    <p className={classNames(styles['fil-deleteconfirmation-text'], styles[`icon-${type}`])}>
      {t(`deleteconfirmation.${type}`, selected.length)}
    </p>
  ))

  return (<Modal
    title={t('deleteconfirmation.title', selected.length)}
    description={deleteConfirmationTexts}
    cancelText={t('deleteconfirmation.cancel')}
    cancelAction={() => onDismiss(selected)}
    validateType='danger'
    validateText={t('deleteconfirmation.delete')}
    validateAction={() => onConfirm(selected)}
   />)
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
