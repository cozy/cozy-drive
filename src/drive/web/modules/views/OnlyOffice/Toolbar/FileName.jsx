import React, { useState, useContext } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'
import { makeStyles } from '@material-ui/core/styles'

import useBreakpoints from 'cozy-ui/transpiled/react/hooks/useBreakpoints'
import Typography from 'cozy-ui/transpiled/react/Typography'
import MidEllipsis from 'cozy-ui/transpiled/react/MidEllipsis'

import { OnlyOfficeContext } from 'drive/web/modules/views/OnlyOffice'
import { RenameInput } from 'drive/web/modules/drive/RenameInput'

import filelistStyles from 'drive/styles/filelist.styl'
import styles from './styles.styl'

const useStyles = makeStyles(() => ({
  name: {
    marginBottom: '3px'
  }
}))

const FileName = ({ fileWithPath }) => {
  const muiStyles = useStyles()
  const { isMobile } = useBreakpoints()
  const { isReadOnly } = useContext(OnlyOfficeContext)
  const [isRenaming, setIsRenaming] = useState(false)
  const isRenamable = !isMobile && !isReadOnly

  return (
    <div className={`${styles['fileName']} u-ml-1 u-ml-half-s u-ellipsis`}>
      {isRenaming ? (
        <Typography variant="h6" noWrap>
          <RenameInput
            className={styles['filename-renameInput']}
            file={fileWithPath}
            withoutExtension
            refreshFolderContent={() => setIsRenaming(false)}
            onAbort={() => setIsRenaming(false)}
          />
        </Typography>
      ) : (
        <Typography
          className={muiStyles.name}
          variant="h6"
          noWrap
          {...isRenamable && { onClick: () => setIsRenaming(true) }}
        >
          {fileWithPath.name}
        </Typography>
      )}
      {fileWithPath.displayedPath && (
        <Link
          to={`/folder/${fileWithPath.dir_id}`}
          className={filelistStyles['fil-file-path']}
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
