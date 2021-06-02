import React, { useState, useContext, useCallback } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'
import { makeStyles } from '@material-ui/core/styles'
import cx from 'classnames'

import useBreakpoints from 'cozy-ui/transpiled/react/hooks/useBreakpoints'
import Typography from 'cozy-ui/transpiled/react/Typography'
import MidEllipsis from 'cozy-ui/transpiled/react/MidEllipsis'

import { OnlyOfficeContext } from 'drive/web/modules/views/OnlyOffice'
import { RenameInput } from 'drive/web/modules/drive/RenameInput'

import filelistStyles from 'drive/styles/filelist.styl'
import styles from './styles.styl'

const useStyles = makeStyles(theme => ({
  name: {
    margin: '1px 0 3px 1px'
  },
  renamable: {
    '&:hover': {
      margin: '0 0 2px',
      border: `1px solid ${theme.palette.text.secondary}`,
      borderRadius: '2px',
      cursor: 'text'
    }
  }
}))

const FileName = ({ fileWithPath }) => {
  const muiStyles = useStyles()
  const { isMobile } = useBreakpoints()
  const { isEditorReadOnly } = useContext(OnlyOfficeContext)
  const [isRenaming, setIsRenaming] = useState(false)

  const onRename = useCallback(() => setIsRenaming(true), [setIsRenaming])
  const onRenameFinished = useCallback(() => setIsRenaming(false), [
    setIsRenaming
  ])

  return (
    <div
      className={`${
        styles['fileName']
      } u-mh-1 u-mh-half-s u-ellipsis u-flex-grow-1`}
    >
      {isRenaming ? (
        <Typography variant="h6" noWrap>
          <RenameInput
            className={styles['filename-renameInput']}
            file={fileWithPath}
            withoutExtension
            refreshFolderContent={onRenameFinished}
            onAbort={onRenameFinished}
          />
        </Typography>
      ) : (
        <Typography
          className={cx(muiStyles.name, {
            [`${muiStyles.renamable}`]: !isEditorReadOnly
          })}
          variant="h6"
          noWrap
          onClick={!isEditorReadOnly && onRename}
        >
          {fileWithPath.name}
        </Typography>
      )}
      {fileWithPath.displayedPath &&
        !isMobile && (
          <Link
            data-testid="onlyoffice-filename-path"
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

export default React.memo(FileName)
