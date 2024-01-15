import PropTypes from 'prop-types'
import React from 'react'

import { EmptyDrive } from 'components/Error/Empty'
import Oops from 'components/Error/Oops'
import FileListRowsPlaceholder from 'modules/filelist/FileListRowsPlaceholder'

const Loader = ({ fetchStatus, hasNoData, children }) => {
  if (fetchStatus === 'loading') return <FileListRowsPlaceholder />
  else if (fetchStatus === 'failed') return <Oops />
  else if (fetchStatus === 'loaded' && hasNoData)
    return <EmptyDrive canUpload={false} />
  else return children
}

Loader.propTypes = {
  fetchStatus: PropTypes.string.isRequired,
  hasNoData: PropTypes.bool,
  children: PropTypes.node
}

export default Loader
