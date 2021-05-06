import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'

import Typography from 'cozy-ui/transpiled/react/Typography'
import MidEllipsis from 'cozy-ui/transpiled/react/MidEllipsis'

import styles from 'drive/styles/filelist.styl'

const FileName = ({ fileWithPath }) => {
  return (
    <div className="u-ml-1 u-ml-half-s u-ellipsis">
      <Typography variant="h6" noWrap>
        {fileWithPath.name}
      </Typography>
      {fileWithPath.displayedPath && (
        <Link
          to={`/folder/${fileWithPath.dir_id}`}
          className={styles['fil-file-path']}
        >
          <Typography variant="caption">
            <MidEllipsis text={fileWithPath.displayedPath} />
          </Typography>
        </Link>
      )}
    </div>
  )
}

FileName.propTypes = {
  fileWithPath: PropTypes.object.isRequired
}

export default FileName
