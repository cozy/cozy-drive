import styles from '../styles/selectionbar'

import React from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'
import { translate } from '../lib/I18n'

import { hideSelectionBar } from '../actions/selection'

const SelectionBar = ({ t, selectedCount, onHide }) => (
  <div
    className={classNames(styles['coz-selectionbar'], {
      [styles['coz-selectionbar--active']]: selectedCount !== 0
    })}
    role='toolbar'
  >
    <span className={styles['coz-selectionbar-count']}>
      {t('SelectionBar.selected_count', { smart_count: selectedCount })}
    </span>
    <span className={styles['coz-selectionbar-separator']} />
    <button
      disabled={selectedCount === 0}
      className={styles['pho-action-album-add']}
    >
      {t('SelectionBar.add_to_album')}
    </button>
    <button className={styles['coz-action-close']} onClick={onHide}>
      {t('SelectionBar.close')}
    </button>
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
)(translate()(SelectionBar))
