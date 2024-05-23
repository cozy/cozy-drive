import React from 'react'

import { FixedDialog } from 'cozy-ui/transpiled/react/CozyDialogs'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'
import { withStyles } from 'cozy-ui/transpiled/react/styles'

import { FolderPickerHeader } from 'components/FolderPicker/FolderPickerHeader'
import { FolderPickerTopbar } from 'components/FolderPicker/FolderPickerTopbar'
import Explorer from 'modules/move/Explorer'
import FileList from 'modules/move/FileList'
import Footer from 'modules/move/Footer'
import Loader from 'modules/move/Loader'
import { shouldRender } from 'modules/views/Upload/UploadUtils'
import { styles } from 'modules/views/Upload/UploaderComponent.styles'
import { useUploadFromFlagship } from 'modules/views/Upload/useUploadFromFlagship'

const _UploaderComponent = (props: {
  classes: Record<string, unknown>
}): JSX.Element => {
  const { t } = useI18n()
  const {
    items,
    uploadFilesFromFlagship,
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
              <FolderPickerHeader
                entries={items}
                title={t('ImportToDrive.title', { smart_count: items.length })}
                subTitle={t('ImportToDrive.to')}
              />
            )}
            <FolderPickerTopbar
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
