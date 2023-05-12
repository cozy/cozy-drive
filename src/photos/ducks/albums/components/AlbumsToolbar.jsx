import React from 'react'

import { ButtonLink } from 'cozy-ui/transpiled/react'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import useBreakpoints from 'cozy-ui/transpiled/react/hooks/useBreakpoints'
import AlbumAddIcon from 'cozy-ui/transpiled/react/Icons/AlbumAdd'

import styles from 'photos/styles/toolbar.styl'
import MoreMenu from '../../../components/MoreMenu'
import { newAlbum } from '../../../components/actions'

const AlbumsToolbar = ({ router }) => {
  const { isMobile } = useBreakpoints()
  const { t } = useI18n()

  const actions = [newAlbum(router)]

  return (
    <div
      data-testid="pho-toolbar-albums"
      className={styles['pho-toolbar']}
      role="toolbar"
    >
      {isMobile ? (
        <MoreMenu actions={actions} />
      ) : (
        <ButtonLink
          data-testid="album-add"
          theme="secondary"
          href="#/albums/new"
          icon={AlbumAddIcon}
          label={t('Toolbar.album_new')}
        />
      )}
    </div>
  )
}

export default AlbumsToolbar
