import React, { useEffect } from 'react'
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
  const { successCount, purgeQueue, queue, doneCount } = props

  useEffect(() => {
    if (successCount == doneCount && successCount === queue?.length) {
      const timer = setTimeout(() => {
        purgeQueue()
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [successCount, purgeQueue, queue, doneCount])

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
