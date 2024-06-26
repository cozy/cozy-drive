import cx from 'classnames'
import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

import { SharedStatus, useSharingContext } from 'cozy-sharing'

import { joinPath } from 'lib/path'
import HammerComponent from 'modules/filelist/HammerComponent'

import styles from 'styles/filelist.styl'

const ShareContent = ({ file, disabled, isInSyncFromSharing }) => {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { byDocId } = useSharingContext()

  const handleClick = () => {
    if (!disabled) {
      // should be only disabled
      navigate(joinPath(pathname, `file/${file._id}/share`))
    }
  }

  const isShared = byDocId[file.id] !== undefined

  return (
    <div
      className={cx(styles['fil-content-sharestatus'], {
        [styles['fil-content-sharestatus--disabled']]: disabled
      })}
    >
      {isInSyncFromSharing || !isShared ? (
        <span data-testid="fil-content-sharestatus--noAvatar">—</span>
      ) : (
        <HammerComponent onClick={handleClick}>
          <SharedStatus docId={file.id} />
        </HammerComponent>
      )}
    </div>
  )
}

export { ShareContent }
