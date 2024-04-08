import React from 'react'

import { FixedDialog } from 'cozy-ui/transpiled/react/CozyDialogs'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'
import { withStyles } from 'cozy-ui/transpiled/react/styles'

import Explorer from 'modules/move/Explorer'
import FileList from 'modules/move/FileList'
import Footer from 'modules/move/Footer'
import Header from 'modules/move/Header'
import Loader from 'modules/move/Loader'
import Topbar from 'modules/move/Topbar'
import { shouldRender } from 'modules/views/Upload/UploadUtils'
import { useUploadFromFlagship } from 'modules/views/Upload/useUploadFromFlagship'

import { styles } from 'modules/views/Upload/UploaderComponent.styles'

const _UploaderComponent = (props: {
  classes: Record<string, unknown>
}): JSX.Element => {
  const { t } = useI18n()
  const {
    items,
    uploadFilesFromFlagship,
    folderQuery,
    contentQuery,
    onClose,
    folder,
    setFolder,
    uploadInProgress
  } = useUploadFromFlagship()

  return (
    <React.Fragment>
      <FixedDialog
        className="u-p-0"
        open
        size="large"
        classes={{
          paper: props.classes.paper
        }}
        title={
          <>
            {shouldRender(items) && (
              <Header
                entries={items}
                title={t('ImportToDrive.title', { smart_count: items.length })}
                subTitle={t('ImportToDrive.to')}
              />
            )}
            <Topbar
              navigateTo={setFolder}
              folderId={folder._id}
              showFolderCreation={false}
            />
          </>
        }
        content={
          <Explorer>
            <Loader
              fetchStatus={contentQuery.fetchStatus}
              hasNoData={
                !Array.isArray(contentQuery.data) ||
                contentQuery.data.length === 0
              }
            >
              <div>
                {shouldRender(items) && (
                  <FileList
                    folder={folder}
                    files={
                      Array.isArray(contentQuery.data) ? contentQuery.data : []
                    }
                    targets={items}
                    navigateTo={setFolder}
                  />
                )}
              </div>
            </Loader>
          </Explorer>
        }
        actions={
          shouldRender(items) && (
            <Footer
              onConfirm={uploadFilesFromFlagship}
              onClose={onClose}
              targets={items}
              currentDirId={folder._id}
              isMoving={uploadInProgress}
              primaryTextAction={t('ImportToDrive.action')}
              secondaryTextAction={t('ImportToDrive.cancel')}
            />
          )
        }
      />
    </React.Fragment>
  )
}

/* eslint-disable */
export const UploaderComponent = withStyles(styles)(_UploaderComponent)
