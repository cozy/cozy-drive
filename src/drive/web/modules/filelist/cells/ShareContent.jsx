import React from 'react'
import cx from 'classnames'

import { SharedStatus } from 'cozy-sharing'

import HammerComponent from 'drive/web/modules/filelist/HammerComponent'

import styles from 'drive/styles/filelist.styl'

const ShareContent = ({
  file,
  setDisplayedModal,
  disabled,
  isInSyncFromSharing
}) => (
  <div
    className={cx(styles['fil-content-sharestatus'], {
      [styles['fil-content-sharestatus--disabled']]: disabled
    })}
  >
    {isInSyncFromSharing ? (
      <span data-testid="fil-content-sharestatus--noAvatar">—</span>
    ) : (
      <HammerComponent
        onClick={() => {
          !disabled && setDisplayedModal(true) // should be only disabled
        }}
      >
        <SharedStatus docId={file.id} />
      </HammerComponent>
    )}
  </div>
)

export { ShareContent }
