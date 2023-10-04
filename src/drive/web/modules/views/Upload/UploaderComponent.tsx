/* eslint-disable no-console */
import React, { useCallback, useState } from 'react'
import { connect } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Query, useClient } from 'cozy-client'
import { FixedDialog } from 'cozy-ui/transpiled/react/CozyDialogs'
import { useI18n } from 'cozy-ui/transpiled/react'
import {
  purgeUploadQueue,
  uploadFilesFromNative
} from 'drive/web/modules/upload'
import { ROOT_DIR_ID } from 'drive/constants/config'
import Header from 'drive/web/modules/move/Header'
import Explorer from 'drive/web/modules/move/Explorer'
import FileList from 'drive/web/modules/move/FileList'
import Loader from 'drive/web/modules/move/Loader'
import LoadMore from 'drive/web/modules/move/LoadMore'
import Footer from 'drive/web/modules/move/Footer'
import Topbar from 'drive/web/modules/move/Topbar'
import {
  buildMoveOrImportQuery,
  buildOnlyFolderQuery
} from 'drive/web/modules/queries'
import { generateForQueue } from './UploadUtils'
import { DumbUploadProps, Folder } from './UploadTypes'
import { ThunkDispatch } from 'redux-thunk'
import { useUploadFromFlagship } from './useUploadFromFlagship'
import { useWebviewIntent } from 'cozy-intent'

const TypedUseI18n = useI18n as () => {
  t: (str: string, arg?: Record<string, unknown>) => string
}
const TypedLoadMore = LoadMore as React.FC<{
  hasMore: boolean
  fetchMore: () => void
}>

const DumbUpload = ({
  onCancel,
  uploadFilesFromNative
}: DumbUploadProps): JSX.Element | null => {
  const [folder, setFolder] = useState<Folder>({ _id: ROOT_DIR_ID })
  const [uploadInProgress] = useState<boolean>(false)
  const { t } = TypedUseI18n()
  const navigate = useNavigate()
  const client = useClient()
  const { items, uploadFilesFromFlagship } = useUploadFromFlagship()
  const webviewIntent = useWebviewIntent()

  const onClose = useCallback(async () => {
    await webviewIntent?.call('resetFilesToHandle').then(() => {
      onCancel()
      return navigate('/')
    })
  }, [navigate, onCancel, webviewIntent])

  const uploadFiles = useCallback(() => {
    if (!items || items.length === 0 || !client) return

    const filesForQueue = generateForQueue(items)
    uploadFilesFromNative(
      filesForQueue,
      folder._id,
      undefined,
      { client },
      uploadFilesFromFlagship
    )
      .then(() => {
        return console.log('uploadFilesFromNative done')
      })
      .catch(e => {
        console.log('uploadFilesFromNative error', e)
      })

    navigate(`/folder/${folder._id}`)
  }, [
    items,
    client,
    uploadFilesFromNative,
    folder._id,
    uploadFilesFromFlagship,
    navigate
  ])

  const contentQuery = buildMoveOrImportQuery(folder._id)
  const folderQuery = buildOnlyFolderQuery(folder._id)

  if (!items || items.length === 0) {
    return null
  }

  return (
    <FixedDialog
      open
      onClose={onClose}
      size="large"
      classes={{ paper: 'u-h-100' }}
      title={
        <>
          <Header
            entries={items}
            title={t('ImportToDrive.title', { smart_count: items.length })}
            subTitle={t('ImportToDrive.to')}
          />
          <Query
            query={folderQuery.definition()}
            fetchPolicy={folderQuery.options.fetchPolicy}
            as={folderQuery.options.as}
            key={`breadcrumb-${folder._id}`}
          >
            {({
              data,
              fetchStatus
            }: {
              data: Record<string, unknown>[]
              fetchStatus: string
            }): JSX.Element => (
              <Topbar
                navigateTo={setFolder}
                currentDir={data}
                fetchStatus={fetchStatus}
              />
            )}
          </Query>
        </>
      }
      content={
        <Query
          key={`content-${folder._id}`}
          query={contentQuery.definition()}
          fetchPolicy={contentQuery.options.fetchPolicy}
          as={contentQuery.options.as}
        >
          {({
            data,
            fetchStatus,
            hasMore,
            fetchMore
          }: {
            data: Record<string, unknown>[]
            fetchStatus: string
            hasMore: boolean
            fetchMore: () => void
          }): JSX.Element => (
            <Explorer>
              <Loader fetchStatus={fetchStatus} hasNoData={data.length === 0}>
                <div>
                  <FileList
                    folder={folder}
                    files={data}
                    targets={items}
                    navigateTo={setFolder}
                  />
                  <TypedLoadMore hasMore={hasMore} fetchMore={fetchMore} />
                </div>
              </Loader>
            </Explorer>
          )}
        </Query>
      }
      actions={
        <Footer
          onConfirm={uploadFiles}
          onClose={onClose}
          targets={items}
          currentDirId={folder._id}
          isMoving={uploadInProgress}
          primaryTextAction={t('ImportToDrive.action')}
          secondaryTextAction={t('ImportToDrive.cancel')}
        />
      }
    />
  )
}

// Typing this is too time consuming at the moment because it would require to
// type the whole store. We should do it later.
/* eslint-disable */
export default connect<any, any, any, any>(
  null,
  (dispatch: ThunkDispatch<any, any, any>) => ({
    onCancel: () => dispatch(purgeUploadQueue()),
    uploadFilesFromNative: (
      files: any,
      folderId: any,
      successCallback: any,
      { client, vaultClient }: any,
      alternateUploader: any
    ) =>
      dispatch(
        uploadFilesFromNative(
          files,
          folderId,
          successCallback,
          { client, vaultClient },
          alternateUploader
        )
      )})
)(DumbUpload)
