import React, { useCallback, useEffect, useState } from 'react'

import { useClient } from 'cozy-client'
import { ConfirmDialog } from 'cozy-ui/transpiled/react/CozyDialogs'
import Button from 'cozy-ui/transpiled/react/deprecated/Button'
import { Media, Img, Bd } from 'cozy-ui/transpiled/react/deprecated/Media'
import Icon from 'cozy-ui/transpiled/react/Icon'
import Stack from 'cozy-ui/transpiled/react/Stack'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'
import { SharedDocument, SharedRecipientsList } from 'cozy-sharing'
import { splitFilename } from 'cozy-client/dist/models/file'

import { buildAlbumByIdQuery } from 'modules/queries'
import { trashFiles } from 'modules/actions/utils'
import { DOCTYPE_ALBUMS } from 'lib/doctypes'
import { getEntriesTypeTranslated } from 'lib/entries'

const Message = ({ type, fileCount }) => {
  const ico =
    type === 'referenced' ? 'album' : type === 'shared' ? 'share' : type

  const { t } = useI18n()
  return (
    <Media>
      <Img>
        <Icon icon={ico} color="var(--coolGrey)" />
      </Img>
      <Bd className={'u-pl-1-half'}>{t(`DeleteConfirm.${type}`, fileCount)}</Bd>
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

  const entriesType = getEntriesTypeTranslated(t, files)

  return (
    <ConfirmDialog
      open={true}
      onClose={onClose}
      title={t('DeleteConfirm.title', {
        filename: splitFilename(files[0]).filename,
        smart_count: fileCount,
        type: entriesType
      })}
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
            label={t('DeleteConfirm.cancel')}
          />
          <Button
            busy={isDeleting}
            theme="danger"
            label={t('DeleteConfirm.delete')}
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
      {({ isSharedByMe, link, recipients }) => {
        const statuses = recipients
          .map(recipient => recipient.status)
          .filter(status => status !== 'owner')

        const isStatusesEqual = statuses.reduce((acc, current) => {
          return acc && current === statuses[0]
        }, true)

        let shareMessageType = !isStatusesEqual
          ? 'share_both'
          : statuses[0] === 'ready'
          ? 'share_accepted'
          : 'share_waiting'

        return (
          <DeleteConfirm files={files} {...rest}>
            {isSharedByMe && link ? (
              <Message type="link" fileCount={files.length} />
            ) : null}
            {isSharedByMe && statuses.length > 0 ? (
              <Message type={shareMessageType} fileCount={files.length} />
            ) : null}
            {isSharedByMe && recipients.length > 0 ? (
              <SharedRecipientsList className={'u-ml-1'} docId={files[0].id} />
            ) : null}
          </DeleteConfirm>
        )
      }}
    </SharedDocument>
  )

export default DeleteConfirmWithSharingContext
