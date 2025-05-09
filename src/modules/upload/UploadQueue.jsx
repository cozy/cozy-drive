import React from 'react'
import { connect } from 'react-redux'

import UIUploadQueue from 'cozy-ui/transpiled/react/UploadQueue'
import { translate } from 'cozy-ui/transpiled/react/providers/I18n'

import {
  getUploadQueue,
  getProcessed,
  getSuccessful,
  purgeUploadQueue
} from '.'

import getMimeTypeIcon from '@/lib/getMimeTypeIcon'

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

export default connect(mapStateToProps, mapDispatchToProps)(DumbUploadQueue)
