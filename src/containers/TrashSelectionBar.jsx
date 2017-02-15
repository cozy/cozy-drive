import styles from '../styles/selectionbar'

import React from 'react'
import { connect } from 'react-redux'
import { translate } from '../lib/I18n'

import { hideSelectionBar, restoreFile, toggleFileSelection } from '../actions'

const TrashSelectionBar = ({ t, selected, onHide, onRestore }) => (
  <div className={styles['fil-selectionbar']} role='toolbar'>
    <button className={styles['fil-action-restore']} onClick={() => onRestore(selected)}>{t('selectionbar.restore')}</button>
    <button className={styles['fil-action-delete']}>{t('selectionbar.perma_delete')}</button>
    <button className={styles['fil-action-close']} onClick={onHide}>{t('selectionbar.close')}</button>
  </div>
)

const mapStateToProps = (state, ownProps) => ({
  selected: state.ui.selected
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  onHide: () => {
    dispatch(hideSelectionBar())
  },
  onRestore: (selected) => {
    selected.forEach(item => {
      dispatch(restoreFile(item))
      dispatch(toggleFileSelection(item, true))
    })
  },
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(translate()(TrashSelectionBar))
