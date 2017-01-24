import styles from '../styles/selectionbar'

import React from 'react'
import { connect } from 'react-redux'
import { translate } from '../lib/I18n'

import { downloadSelection } from '../actions'

const SelectionBar = ({ t, selectedCount, onDownload }) => (
  <div className={styles['fil-selectionbar']} role='toolbar'>
    <span className={styles['fil-selectionbar-count']}>
      {t('selectionbar.selected_count', { smart_count: selectedCount })}
    </span>
    <span className={styles['fil-selectionbar-separator']} />
    <button className={styles['fil-action-share']}>{t('selectionbar.share')}</button>
    <button className={styles['fil-action-download']} onClick={onDownload}>{t('selectionbar.download')}</button>
    <button className={styles['fil-action-delete']}>{t('selectionbar.delete')}</button>
    <button className={styles['fil-action-moveto']}>{t('selectionbar.moveto')}</button>
    <button className={styles['fil-action-rename']}>{t('selectionbar.rename')}</button>
  </div>
)

const mapStateToProps = (state, ownProps) => ({
  selectedCount: state.ui.selected.length
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  onDownload: () => {
    dispatch(downloadSelection())
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(translate()(SelectionBar))
