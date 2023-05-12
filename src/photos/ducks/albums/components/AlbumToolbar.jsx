import React from 'react'

import { ShareButton, SharedRecipients } from 'cozy-sharing'
import useBreakpoints from 'cozy-ui/transpiled/react/hooks/useBreakpoints'
import { divider } from 'cozy-ui/transpiled/react/ActionsMenu/Actions'

import {
  shareAlbum as shareAlbumAction,
  download,
  renameAlbum,
  editAlbum,
  selectItems as selectItemsAction,
  deleteAlbum as deleteAlbumAction
} from '../../../components/actions'
import MoreMenu from '../../../components/MoreMenu'
import styles from 'photos/styles/toolbar.styl'

function insertIf(condition, element) {
  return condition ? [element] : []
}

const AlbumToolbar = ({
  t,
  router,
  album,
  sharedWithMe,
  readOnly,
  disabled = false,
  downloadAlbum,
  deleteAlbum,
  selectItems,
  onRename,
  shareAlbum
}) => {
  const { isMobile } = useBreakpoints()

  const actions = [
    ...insertIf(!sharedWithMe && isMobile, shareAlbumAction(shareAlbum, album)),
    download(downloadAlbum, t('Toolbar.menu.download_album')),
    renameAlbum(onRename),
    ...insertIf(!readOnly, editAlbum(router)),
    ...insertIf(isMobile, divider),
    ...insertIf(isMobile, selectItemsAction(selectItems)),
    divider,
    ...insertIf(!sharedWithMe, deleteAlbumAction(deleteAlbum))
  ]

  return (
    <div
      data-testid="pho-toolbar-album"
      className={styles['pho-toolbar']}
      role="toolbar"
    >
      {!isMobile && (
        <>
          <SharedRecipients
            docId={album.id}
            onClick={() => shareAlbum(album)}
          />
          <ShareButton
            disabled={disabled}
            label={t('Albums.share.cta')}
            onClick={() => shareAlbum(album)}
            docId={album.id}
          />
        </>
      )}
      <MoreMenu actions={actions} />
    </div>
  )
}

export default AlbumToolbar
