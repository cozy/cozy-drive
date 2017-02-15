import styles from '../styles/selectionbar'

import React from 'react'
import { connect } from 'react-redux'
import { translate } from '../lib/I18n'

import { hideSelectionBar } from '../actions'

const TrashSelectionBar = ({ t, selectedCount, onDownload, onHide, onDelete }) => (
  <div className={styles['fil-selectionbar']} role='toolbar'>
    <button className={styles['fil-action-restore']}>{t('selectionbar.restore')}</button>
    <button className={styles['fil-action-delete']}>{t('selectionbar.perma_delete')}</button>
    <button className={styles['fil-action-close']} onClick={onHide}>{t('selectionbar.close')}</button>
  </div>
)

const mapStateToProps = (state, ownProps) => ({
  selectedCount: state.ui.selected.length
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  onHide: () => {
    dispatch(hideSelectionBar())
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(translate()(TrashSelectionBar))
