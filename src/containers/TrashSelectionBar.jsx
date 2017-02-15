import styles from '../styles/selectionbar'

import React from 'react'
import { connect } from 'react-redux'
import { translate } from '../lib/I18n'

import { downloadSelection, hideSelectionBar, showDeleteConfirmation } from '../actions'

const TrashSelectionBar = ({ t, selectedCount, onDownload, onHide, onDelete }) => (
  <div className={styles['fil-selectionbar']} role='toolbar'>
    <span className={styles['fil-selectionbar-count']}>
      {t('selectionbar.selected_count', { smart_count: selectedCount })}
    </span>
    <span className={styles['fil-selectionbar-separator']} />
    <button className={styles['fil-action-share']}>{t('selectionbar.share')}</button>
    <button className={styles['fil-action-download']} onClick={onDownload}>{t('selectionbar.download')}</button>
    <button className={styles['fil-action-delete']} onClick={onDelete}>{t('selectionbar.delete')}</button>
    <button className={styles['fil-action-moveto']}>{t('selectionbar.moveto')}</button>
    <button className={styles['fil-action-rename']}>{t('selectionbar.rename')}</button>
    <button className={styles['fil-action-close']} onClick={onHide}>{t('selectionbar.close')}</button>
  </div>
)

const mapStateToProps = (state, ownProps) => ({
  selectedCount: state.ui.selected.length
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  onDownload: () => {
    dispatch(downloadSelection())
  },
  onHide: () => {
    dispatch(hideSelectionBar())
  },
  onDelete: () => {
    dispatch(showDeleteConfirmation())
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(translate()(TrashSelectionBar))
