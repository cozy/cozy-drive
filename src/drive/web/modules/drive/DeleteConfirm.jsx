import React, { useCallback, useEffect, useState } from 'react'
import { useClient } from 'cozy-client'
import { ConfirmDialog } from 'cozy-ui/transpiled/react/CozyDialogs'
import Button from 'cozy-ui/transpiled/react/Button'
import { buildAlbumByIdQuery } from 'drive/web/modules/queries'
import { Media, Img, Bd } from 'cozy-ui/transpiled/react/Media'
import Icon from 'cozy-ui/transpiled/react/Icon'
import Stack from 'cozy-ui/transpiled/react/Stack'

import { useI18n } from 'cozy-ui/transpiled/react/I18n'

import { SharedDocument, SharedRecipientsList } from 'cozy-sharing'

import { trashFiles } from 'drive/web/modules/actions/utils'
import { DOCTYPE_ALBUMS } from 'drive/lib/doctypes'

const Message = ({ type, fileCount }) => {
  const ico =
    type === 'referenced' ? 'album' : type === 'shared' ? 'share' : type

  const { t } = useI18n()
  return (
    <Media>
      <Img>
        <Icon icon={ico} color="var(--coolGrey)" />
      </Img>
      <Bd className={'u-pl-1-half'}>
        {t(`deleteconfirmation.${type}`, fileCount)}
      </Bd>
    </Media>
  )
}

export const DeleteConfirm = ({
  files,
  afterConfirmation,
  onClose,
  children
}) => {
  const { t } = useI18n()
  const fileCount = files.length
  const client = useClient()
  const [isDeleting, setDeleting] = useState(false)
  const [isReferencedByManualAlbum, setIsReferencedByManualAlbum] =
    useState(false)

  useEffect(() => {
    const fetchAlbums = async () => {
      const albumIdsFromFiles = files.flatMap(file =>
        (
          (file &&
            file.relationships &&
            file.relationships.referenced_by &&
            file.relationships.referenced_by.data) ||
          []
        )
          .filter(reference => reference.type === DOCTYPE_ALBUMS)
          .map(reference => reference.id)
      )

      const albums = await Promise.all(
        albumIdsFromFiles.map(albumId => {
          const albumByIdQuery = buildAlbumByIdQuery(albumId)
          return client.fetchQueryAndGetFromState({
            definition: albumByIdQuery.definition,
            options: albumByIdQuery.options
          })
        })
      )

      setIsReferencedByManualAlbum(
        !!albums.filter(album => album && album.data && !album.data.auto).length
      )
    }
    fetchAlbums()
  }, [client, files])

  const onDelete = useCallback(async () => {
    setDeleting(true)
    await trashFiles(client, files)
    afterConfirmation()
    onClose()
  }, [client, files, afterConfirmation, onClose])

  return (
    <ConfirmDialog
      open={true}
      onClose={onClose}
      title={t('deleteconfirmation.title', fileCount)}
      content={
        <Stack>
          <Message type="trash" fileCount={fileCount} />
          <Message type="restore" fileCount={fileCount} />
          {isReferencedByManualAlbum && (
            <Message type="referenced" fileCount={fileCount} />
          )}
          {children}
        </Stack>
      }
      actions={
        <>
          <Button
            theme="secondary"
            onClick={onClose}
            label={t('deleteconfirmation.cancel')}
          />
          <Button
            busy={isDeleting}
            theme="danger"
            label={t('deleteconfirmation.delete')}
            onClick={onDelete}
          />
        </>
      }
    />
  )
}

const DeleteConfirmWithSharingContext = ({ files, ...rest }) =>
  files.length !== 1 ? (
    <DeleteConfirm files={files} {...rest} />
  ) : (
    <SharedDocument docId={files[0].id}>
      {({ isSharedByMe, link, recipients }) => (
        <DeleteConfirm files={files} {...rest}>
          {isSharedByMe && link && (
            <Message type="link" fileCount={files.length} />
          )}
          {isSharedByMe && recipients.length > 0 && (
            <Message type="shared" fileCount={files.length} />
          )}
          {isSharedByMe && recipients.length > 0 && (
            <SharedRecipientsList className={'u-ml-1'} docId={files[0].id} />
          )}
        </DeleteConfirm>
      )}
    </SharedDocument>
  )

export default DeleteConfirmWithSharingContext
