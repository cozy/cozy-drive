import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'

import { withStyles } from 'cozy-ui/transpiled/react/styles'
import { Query, cancelable, Q, useClient } from 'cozy-client'
import { useSharingContext } from 'cozy-sharing'
import { FixedDialog } from 'cozy-ui/transpiled/react/CozyDialogs'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import Alerter from 'cozy-ui/transpiled/react/deprecated/Alerter'
import { useBreakpoints } from 'cozy-ui/transpiled/react'

import { ROOT_DIR_ID } from 'drive/constants/config'
import Header from 'drive/web/modules/move/Header'
import Explorer from 'drive/web/modules/move/Explorer'
import FileList from 'drive/web/modules/move/FileList'
import Loader from 'drive/web/modules/move/Loader'
import LoadMore from 'drive/web/modules/move/LoadMore'
import Footer from 'drive/web/modules/move/Footer'
import Topbar from 'drive/web/modules/move/Topbar'
import { CozyFile } from 'models'
import logger from 'lib/logger'
import { useDisplayedFolder } from 'drive/hooks'
import {
  buildMoveOrImportQuery,
  buildOnlyFolderQuery
} from 'drive/web/modules/queries'
import { cancelMove } from 'drive/web/modules/move/helpers'

const styles = theme => ({
  paper: {
    height: '100%',
    '& .MuiDialogContent-root': {
      padding: '0'
    },
    '& .MuiDialogTitle-root': {
      padding: '0',
      [theme.breakpoints.down('sm')]: {
        width: '100%',
        overflow: 'visible',
        // back button
        '& .MuiButtonBase-root': {
          display: 'none'
        }
      }
    }
  }
})

/**
 * Modal to move a folder to an other
 */
const MoveModal = ({ onClose, entries, classes }) => {
  const { t } = useI18n()
  const client = useClient()
  const { isMobile } = useBreakpoints()
  const displayedFolder = useDisplayedFolder()
  const { sharedPaths, refresh: refreshSharing } = useSharingContext()

  const [folderId, setFolderId] = useState(
    displayedFolder ? displayedFolder._id : ROOT_DIR_ID
  )

  const [isMoveInProgress, setMoveInProgress] = useState(false)
  const [promises, setPromises] = useState([])

  useEffect(() => {
    // unregister cancelables when component will unmount
    return () => {
      promises.forEach(p => p.cancel())
      setPromises([])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const navigateTo = folder => {
    setFolderId(folder._id)
  }

  const registerCancelable = promise => {
    if (!promises) setPromises([])
    const cancelableP = cancelable(promise)
    setPromises([...promises, cancelableP])
    return cancelableP
  }

  const moveEntries = async () => {
    try {
      setMoveInProgress(true)
      const trashedFiles = []
      await Promise.all(
        entries.map(async entry => {
          const targetPath = await registerCancelable(
            CozyFile.getFullpath(folderId, entry.name)
          )
          const force = !sharedPaths.includes(targetPath)
          const moveResponse = await registerCancelable(
            CozyFile.move(entry._id, { folderId }, force)
          )
          if (moveResponse.deleted) {
            trashedFiles.push(moveResponse.deleted)
          }
        })
      )

      const response = await registerCancelable(
        client.query(Q('io.cozy.files').getById(folderId))
      )
      const targetName = response.data?.name || t('breadcrumb.title_drive')
      Alerter.info('Move.success', {
        subject: entries.length === 1 ? entries[0].name : '',
        target: targetName,
        smart_count: entries.length,
        buttonText: t('Move.cancel'),
        buttonAction: () =>
          cancelMove({
            entries,
            trashedFiles,
            client,
            registerCancelable,
            refreshSharing
          })
      })
      if (refreshSharing) refreshSharing()
    } catch (e) {
      logger.warn(e)
      Alerter.error('Move.error', { smart_count: entries.length })
    } finally {
      setMoveInProgress(false)
      onClose({
        cancelSelection: true
      })
    }
  }

  const contentQuery = buildMoveOrImportQuery(folderId)
  const folderQuery = buildOnlyFolderQuery(folderId)

  return (
    <FixedDialog
      open
      onClose={isMobile ? undefined : onClose}
      size="large"
      classes={{
        paper: classes.paper
      }}
      title={
        <>
          <Header entries={entries} />
          <Query
            query={folderQuery.definition()}
            fetchPolicy={folderQuery.options.fetchPolicy}
            as={folderQuery.options.as}
            key={`breadcrumb-${folderId}`}
          >
            {({ data, fetchStatus }) => (
              <Topbar
                navigateTo={navigateTo}
                currentDir={data}
                fetchStatus={fetchStatus}
              />
            )}
          </Query>
        </>
      }
      content={
        <Query
          query={contentQuery.definition()}
          fetchPolicy={contentQuery.options.fetchPolicy}
          as={contentQuery.options.as}
          key={`content-${folderId}`}
        >
          {({ data, fetchStatus, hasMore, fetchMore }) => {
            return (
              <Explorer>
                <Loader fetchStatus={fetchStatus} hasNoData={data.length === 0}>
                  <FileList
                    files={data}
                    targets={entries}
                    navigateTo={navigateTo}
                  />
                  <LoadMore hasMore={hasMore} fetchMore={fetchMore} />
                </Loader>
              </Explorer>
            )
          }}
        </Query>
      }
      actions={
        <Footer
          onConfirm={moveEntries}
          onClose={onClose}
          targets={entries}
          currentDirId={folderId}
          isMoving={isMoveInProgress}
        />
      }
    />
  )
}

MoveModal.propTypes = {
  /** List of files or folder to move */
  entries: PropTypes.array
}

export { MoveModal }

export default withStyles(styles)(MoveModal)
