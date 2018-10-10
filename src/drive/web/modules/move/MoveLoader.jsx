import React from 'react'
import PropTypes from 'prop-types'
import Oops from 'components/Error/Oops'
import { EmptyDrive } from 'components/Error/Empty'
import FileListRowsPlaceholder from 'drive/web/modules/filelist/FileListRowsPlaceholder'

const MoveLoader = ({ fetchStatus, hasNoData, children }) => {
  if (fetchStatus === 'loading') return <FileListRowsPlaceholder />
  else if (fetchStatus === 'failed') return <Oops />
  else if (fetchStatus === 'loaded' && hasNoData)
    return <EmptyDrive canUpload={false} />
  else return children
}

MoveLoader.propTypes = {
  fetchStatus: PropTypes.string.isRequired,
  hasNoData: PropTypes.bool,
  children: PropTypes.node
}

export default MoveLoader
