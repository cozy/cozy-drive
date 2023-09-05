import React from 'react'
import cx from 'classnames'
import { useNavigate, useLocation } from 'react-router-dom'

import { SharedStatus, useSharingContext } from 'cozy-sharing'

import HammerComponent from 'drive/web/modules/filelist/HammerComponent'

import styles from 'drive/styles/filelist.styl'

const ShareContent = ({ file, disabled, isInSyncFromSharing }) => {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { byDocId } = useSharingContext()

  const handleClick = () => {
    if (!disabled) {
      // should be only disabled
      navigate(
        `${pathname}${pathname.endsWith('/') ? '' : '/'}file/${file._id}/share`
      )
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
