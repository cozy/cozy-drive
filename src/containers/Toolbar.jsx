import styles from '../styles/toolbar'

import React from 'react'
import { connect } from 'react-redux'
import { translate } from '../lib/I18n'

import UploadButton from './UploadButton'

import { addFolder } from '../actions'

const Toolbar = ({ t, addFolder }) => (
  <div className={styles['fil-content-toolbar']} role='toolbar'>
    <UploadButton />
    <button
      role='button'
      className='coz-btn coz-btn--more'
      onClick={() => addFolder()}
    >
      <span class='coz-hidden'>{ t('toolbar.item_more') }</span>
    </button>
  </div>
)

const mapStateToProps = (state, ownProps) => ({})

const mapDispatchToProps = (dispatch, ownProps) => ({
  addFolder: () => {
    dispatch(addFolder())
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(translate()(Toolbar))
