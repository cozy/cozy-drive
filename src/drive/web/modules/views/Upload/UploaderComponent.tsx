import React from 'react'

import { withStyles } from 'cozy-ui/transpiled/react/styles'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'
import { FixedDialog } from 'cozy-ui/transpiled/react/CozyDialogs'

import Header from 'drive/web/modules/move/Header'
import Explorer from 'drive/web/modules/move/Explorer'
import FileList from 'drive/web/modules/move/FileList'
import Loader from 'drive/web/modules/move/Loader'
import Footer from 'drive/web/modules/move/Footer'
import Topbar from 'drive/web/modules/move/Topbar'
import { useUploadFromFlagship } from 'drive/web/modules/views/Upload/useUploadFromFlagship'
import { shouldRender } from 'drive/web/modules/views/Upload/UploadUtils'
import { styles } from 'drive/web/modules/views/Upload/UploaderComponent.styles'

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
              currentDir={folderQuery.data}
              fetchStatus={folderQuery.fetchStatus}
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
