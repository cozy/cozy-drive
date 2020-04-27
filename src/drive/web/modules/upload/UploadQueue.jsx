import React from 'react'
import { connect } from 'react-redux'
import UIUploadQueue from 'cozy-ui/transpiled/react/UploadQueue'
import { translate } from 'cozy-ui/transpiled/react/I18n'
import getMimeTypeIcon from 'drive/lib/getMimeTypeIcon'

import {
  getUploadQueue,
  getProcessed,
  getSuccessful,
  purgeUploadQueue
} from '.'

export const DumbUploadQueue = translate()(props => {
  return (
    <UIUploadQueue
      popover={true}
      getMimeTypeIcon={getMimeTypeIcon}
      app="Cozy Drive"
      {...props}
    />
  )
})

const mapStateToProps = state => ({
  queue: getUploadQueue(state),
  doneCount: getProcessed(state).length,
  successCount: getSuccessful(state).length
})
const mapDispatchToProps = dispatch => ({
  purgeQueue: () => dispatch(purgeUploadQueue())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DumbUploadQueue)
