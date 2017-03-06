import styles from '../styles/selectionbar'

import React from 'react'
import { connect } from 'react-redux'
import { translate } from '../lib/I18n'
import classNames from 'classnames'

import { downloadSelection, hideSelectionBar, showFileActionMenu, showDeleteConfirmation } from '../actions'

const FilesSelectionBar = ({ t, selectedCount, onDownload, onHide, onDelete, onShowActionMenu }) => (
  <div className={styles['coz-selectionbar']} role='toolbar'>
    <span className={styles['coz-selectionbar-count']}>
      {selectedCount}
      <span> {t('selectionbar.selected_count', { smart_count: selectedCount })}</span>
    </span>
    <span className={styles['coz-selectionbar-separator']} />
    <button className={styles['coz-action-share']}>{t('selectionbar.share')}</button>
    <button className={styles['coz-action-download']} onClick={onDownload}>{t('selectionbar.download')}</button>
    <button className={styles['coz-action-delete']} onClick={onDelete}>{t('selectionbar.delete')}</button>
    <button className={styles['coz-action-moveto']}>{t('selectionbar.moveto')}</button>
    <button className={styles['coz-action-rename']}>{t('selectionbar.rename')}</button>
    <button className={classNames('coz-btn', 'coz-btn--extra', 'coz-btn--extra-white', styles['coz-action-extra'])} onClick={onShowActionMenu} />
    <button className={styles['coz-action-close']} onClick={onHide}>{t('selectionbar.close')}</button>
  </div>
)

const mapStateToProps = (state, ownProps) => ({
  selectedCount: state.ui.selected.length
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  onDownload: () => {
    dispatch(downloadSelection())
    dispatch(hideSelectionBar())
  },
  onHide: () => {
    dispatch(hideSelectionBar())
  },
  onDelete: () => {
    dispatch(showDeleteConfirmation())
  },
  onShowActionMenu: () => {
    dispatch(showFileActionMenu())
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(translate()(FilesSelectionBar))
