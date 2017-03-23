import styles from '../styles/selectionbar'

import React from 'react'
import { connect } from 'react-redux'
import { translate } from '../lib/I18n'
import classNames from 'classnames'

import { downloadSelection, hideSelectionBar, showFileActionMenu, showDeleteConfirmation } from '../actions'

const FilesSelectionBar = ({ t, selected, onDownload, onHide, onDelete, onShowActionMenu }) => (
  <div className={styles['coz-selectionbar']} role='toolbar'>
    <span className={styles['coz-selectionbar-count']}>
      {selected.length}
      <span> {t('selectionbar.selected_count', { smart_count: selected.length })}</span>
    </span>
    <span className={styles['coz-selectionbar-separator']} />
    {/* <button className={styles['coz-action-share']}>{t('selectionbar.share')}</button> */}
    <button className={styles['coz-action-download']} disabled={selected.length < 1} onClick={onDownload}>{t('selectionbar.download')}</button>
    <button className={styles['coz-action-delete']} disabled={selected.length < 1} onClick={onDelete}>{t('selectionbar.delete')}</button>
    {/* <button className={styles['coz-action-moveto']}>{t('selectionbar.moveto')}</button> */}
    {/* <button className={styles['coz-action-rename']}>{t('selectionbar.rename')}</button> */}
    <button className={classNames('coz-btn', 'coz-btn--extra-white')} disabled={selected.length < 1} onClick={onShowActionMenu} />
    <button className={styles['coz-action-close']} onClick={onHide}>{t('selectionbar.close')}</button>
  </div>
)

const mapDispatchToProps = (dispatch, ownProps) => ({
  onDownload: () => {
    dispatch(downloadSelection(ownProps.selected))
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

export default connect(null, mapDispatchToProps)(translate()(FilesSelectionBar))
