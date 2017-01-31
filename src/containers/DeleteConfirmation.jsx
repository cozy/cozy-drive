//import styles from '../styles/alerter'

import React from 'react'
import { connect } from 'react-redux'
import { translate } from '../lib/I18n'

//import { downloadSelection, hideSelectionBar, showDeleteConfirmation } from '../actions'

const DeleteConfirmation = ({ t }) => (
  <div>
    delete me?
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
