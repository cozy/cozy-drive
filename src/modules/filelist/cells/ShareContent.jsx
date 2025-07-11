import cx from 'classnames'
import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

import { SharedStatus, useSharingContext } from 'cozy-sharing'

import styles from '@/styles/filelist.styl'

import { useViewSwitcherContext } from '@/lib/ViewSwitcherContext'
import { joinPath } from '@/lib/path'

const ShareContent = ({ file, disabled, isInSyncFromSharing }) => {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { byDocId } = useSharingContext()
  const { viewType } = useViewSwitcherContext()

  const handleClick = e => {
    // Avoid to trigger row click from FileOpener
    e.preventDefault()
    e.stopPropagation()

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
        viewType === 'list' ? (
          <span data-testid="fil-content-sharestatus--noAvatar">—</span>
        ) : null
      ) : (
        <SharedStatus onClick={handleClick} docId={file.id} />
      )}
    </div>
  )
}

export { ShareContent }
