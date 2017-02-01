import styles from '../styles/deleteconfirmation'
import classNames from 'classnames'

import React from 'react'
import { connect } from 'react-redux'
import { translate } from '../lib/I18n'

//import { downloadSelection, hideSelectionBar, showDeleteConfirmation } from '../actions'

const DeleteConfirmation = ({ t }) => (
  <div className={styles['fil-deleteconfirmation']}>
    <div className={styles['coz-overlay']}>
      <div className={styles['coz-modal']}>
        <h2 className={styles['coz-modal-title']}>
          Delete this File?
        </h2>
        <button className={classNames('coz-btn', 'coz-btn--close', styles['coz-modal-close'])}>
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
          <button className={styles['secondary']}>
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
})

const mapDispatchToProps = (dispatch, ownProps) => ({
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(translate()(DeleteConfirmation))
