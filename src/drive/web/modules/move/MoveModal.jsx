import React from 'react'
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { withStyles } from 'cozy-ui/transpiled/react/styles'

import { Query, cancelable, withClient, Q } from 'cozy-client'
import { CozyFile } from 'models'
import logger from 'lib/logger'

import { RefreshableSharings } from 'cozy-sharing'
import withSharingState from 'cozy-sharing/dist/hoc/withSharingState'
import { FixedDialog } from 'cozy-ui/transpiled/react/CozyDialogs'
import { translate } from 'cozy-ui/transpiled/react/I18n'
import Alerter from 'cozy-ui/transpiled/react/Alerter'
import { getTracker } from 'cozy-ui/transpiled/react/helpers/tracker'
import { withBreakpoints } from 'cozy-ui/transpiled/react'

import { ROOT_DIR_ID } from 'drive/constants/config'
import Header from 'drive/web/modules/move/Header'
import Explorer from 'drive/web/modules/move/Explorer'
import FileList from 'drive/web/modules/move/FileList'
import Loader from 'drive/web/modules/move/Loader'
import LoadMore from 'drive/web/modules/move/LoadMore'
import Footer from 'drive/web/modules/move/Footer'
import Topbar from 'drive/web/modules/move/Topbar'

import { getDisplayedFolder } from 'drive/web/modules/selectors'
import {
  buildMoveOrImportQuery,
  buildOnlyFolderQuery
} from 'drive/web/modules/queries'

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

export class MoveModal extends React.Component {
  constructor(props) {
    super(props)
    this.promises = []
    const { displayedFolder } = props
    this.state = {
      folderId: displayedFolder ? displayedFolder._id : ROOT_DIR_ID,
      isMoveInProgress: false
    }
  }

  componentWillUnmount() {
    this.unregisterCancelables()
  }

  navigateTo = folder => {
    this.setState({ folderId: folder._id })
  }

  registerCancelable = promise => {
    if (!this.promises) this.promises = []
    const cancelableP = cancelable(promise)
    this.promises.push(cancelableP)
    return cancelableP
  }

  unregisterCancelables = () => {
    this.promises.forEach(p => p.cancel())
    this.promises = []
  }

  moveEntries = async callback => {
    const { client, entries, onClose, sharingState, t } = this.props
    const { sharedPaths } = sharingState
    const { folderId } = this.state
    try {
      this.setState({ isMoveInProgress: true })
      const trashedFiles = []
      await Promise.all(
        entries.map(async entry => {
          const targetPath = await this.registerCancelable(
            CozyFile.getFullpath(folderId, entry.name)
          )
          const force = !sharedPaths.includes(targetPath)
          const moveResponse = await this.registerCancelable(
            CozyFile.move(entry._id, { folderId }, force)
          )
          if (moveResponse.deleted) {
            trashedFiles.push(moveResponse.deleted)
          }
        })
      )

      const response = await this.registerCancelable(
        client.query(Q('io.cozy.files').getById(folderId))
      )
      const targetName = response.data.name || t('breadcrumb.title_drive')
      Alerter.info('Move.success', {
        subject: entries.length === 1 ? entries[0].name : '',
        target: targetName,
        smart_count: entries.length,
        buttonText: t('Move.cancel'),
        buttonAction: () => this.cancelMove(entries, trashedFiles, callback)
      })
      this.trackEvent(entries.length)
      if (callback) callback()
    } catch (e) {
      logger.warn(e)
      Alerter.error('Move.error', { smart_count: entries.length })
    } finally {
      this.setState({ isMoveInProgress: false })
      onClose({
        cancelSelection: true
      })
    }
  }

  cancelMove = async (entries, trashedFiles, callback) => {
    const { client } = this.props
    try {
      await Promise.all(
        entries.map(entry =>
          this.registerCancelable(
            CozyFile.move(entry._id, { folderId: entry.dir_id })
          )
        )
      )
      const fileCollection = client.collection(CozyFile.doctype)
      let restoreErrorsCount = 0
      await Promise.all(
        trashedFiles.map(id => {
          try {
            this.registerCancelable(fileCollection.restore(id))
          } catch {
            restoreErrorsCount++
          }
        })
      )
      if (restoreErrorsCount) {
        Alerter.info('Move.cancelledWithRestoreErrors', {
          subject: entries.length === 1 ? entries[0].name : '',
          smart_count: entries.length,
          restoreErrorsCount
        })
      } else {
        Alerter.info('Move.cancelled', {
          subject: entries.length === 1 ? entries[0].name : '',
          smart_count: entries.length
        })
      }
    } catch (e) {
      logger.warn(e)
      Alerter.error('Move.cancelled_error', { smart_count: entries.length })
    } finally {
      if (callback) callback()
    }
  }

  trackEvent(eventValue) {
    const tracker = getTracker()
    if (tracker) {
      tracker.push(['trackEvent', 'Drive', 'move', 'moveTo', eventValue])
    }
  }

  render() {
    const {
      onClose,
      entries,
      classes,
      breakpoints: { isMobile }
    } = this.props
    const { folderId, isMoveInProgress } = this.state

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
                  navigateTo={this.navigateTo}
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
                  <Loader
                    fetchStatus={fetchStatus}
                    hasNoData={data.length === 0}
                  >
                    <FileList
                      files={data}
                      targets={entries}
                      navigateTo={this.navigateTo}
                    />
                    <LoadMore hasMore={hasMore} fetchMore={fetchMore} />
                  </Loader>
                </Explorer>
              )
            }}
          </Query>
        }
        actions={
          <RefreshableSharings>
            {({ refresh }) => (
              <Footer
                onConfirm={() => this.moveEntries(refresh)}
                onClose={onClose}
                targets={entries}
                currentDirId={folderId}
                isMoving={isMoveInProgress}
              />
            )}
          </RefreshableSharings>
        }
      />
    )
  }
}

MoveModal.propTypes = {
  client: PropTypes.object.isRequired,
  displayedFolder: PropTypes.object.isRequired,
  entries: PropTypes.array,
  t: PropTypes.func.isRequired,
  // in case of move conflicts, shared files are not overridden
  sharingState: PropTypes.object
}

const mapStateToProps = state => ({
  displayedFolder: getDisplayedFolder(state)
})

export default compose(
  connect(mapStateToProps),
  translate(),
  withClient,
  withSharingState,
  withStyles(styles),
  withBreakpoints()
)(MoveModal)
