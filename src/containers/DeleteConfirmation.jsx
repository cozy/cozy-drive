import styles from '../styles/deleteconfirmation'
import classNames from 'classnames'

import React from 'react'
import { connect } from 'react-redux'
import { translate } from '../lib/I18n'

import { hideDeleteConfirmation, toggleFileSelection } from '../actions'

const DeleteConfirmation = ({ t, selected, onDismiss }) => (
  <div className={styles['fil-deleteconfirmation']}>
    <div className={styles['coz-overlay']}>
      <div className={styles['coz-modal']}>
        <h2 className={styles['coz-modal-title']}>
          Delete this File?
        </h2>
        <button
          className={classNames('coz-btn', 'coz-btn--close', styles['coz-modal-close'])}
          onClick={() => onDismiss(selected)}
          >
          <span className='coz-hidden'>close</span>
        </button>
        <p className={classNames(styles['fil-deleteconfirmation-text'], styles['icon-trash'])}>
          Your folder will be trashed
        </p>
        <p className={classNames(styles['fil-deleteconfirmation-text'], styles['icon-restore'])}>
          restore
        </p>
        <p className={classNames(styles['fil-deleteconfirmation-text'], styles['icon-shared'])}>
          shared
        </p>
        <div className={styles['fil-deleteconfirmation-buttons']}>
          <button className={styles['secondary']} onClick={() => onDismiss(selected)}>
            cancel
          </button>
          <button className={styles['danger']}>
            delete
          </button>
        </div>
      </div>
    </div>
  </div>
)

const mapStateToProps = (state, ownProps) => ({
  selected: state.ui.selected
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  onDismiss: (selected) => {
    dispatch(hideDeleteConfirmation())
    selected.forEach(item => dispatch(toggleFileSelection(item, true)))
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(translate()(DeleteConfirmation))
