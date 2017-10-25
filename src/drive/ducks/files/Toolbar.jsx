import styles from '../../styles/toolbar'

import React from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'

import { ROOT_DIR_ID } from '../../constants/config'
import { alertShow } from 'cozy-ui/react/Alerter'
import { translate } from 'cozy-ui/react/I18n'

import { IntentButton } from '../../components/Intent'
import Menu, { Item } from '../../components/Menu'
import QuotaAlert from '../../components/QuotaAlert'
import ShareButton from '../../components/ShareButton'
import UploadButton from '../../components/UploadButton'

import { alert } from '../../lib/confirm'
import { addToUploadQueue } from '../upload'
import { uploadedFile, downloadFiles } from '../../actions'
import { ShareModal } from 'sharing'

const toggleShowShareModal = state => ({
  ...state,
  showShareModal: !state.showShareModal
})

const ALERT_LEVEL_INFO = 'info'
const ALERT_LEVEL_ERROR = 'error'
const ALERT_LEVEL_SUCCESS = 'success'

class Toolbar extends React.Component {
  state = {
    showShareModal: false
  }

  render() {
    const {
      t,
      disabled,
      displayedFolder,
      actions,
      onSelectItemsClick,
      canUpload,
      uploadFiles,
      downloadAll
    } = this.props
    const notRootfolder = displayedFolder && displayedFolder.id !== ROOT_DIR_ID
    return (
      <div className={styles['fil-toolbar-files']} role="toolbar">
        <IntentButton
          className={classNames(
            styles['c-btn'],
            styles['c-btn--regular'],
            styles['u-hide--mob']
          )}
          action="CREATE"
          docType="io.cozy.accounts"
          data={{
            dataType: 'bill'
          }}
        >
          {t('service.bills')}
        </IntentButton>
        {canUpload && (
          <UploadButton
            disabled={disabled}
            onUpload={files => uploadFiles(files, displayedFolder)}
            label={t('toolbar.item_upload')}
            className={classNames(
              styles['c-btn'],
              styles['c-btn--regular'],
              styles['c-btn--upload'],
              styles['u-hide--mob']
            )}
          />
        )}
        {notRootfolder && (
          <ShareButton
            disabled={disabled}
            onShare={() => this.setState(toggleShowShareModal)}
            label={t('toolbar.share')}
            className={styles['u-hide--mob']}
          />
        )}
        <Menu
          title={t('toolbar.item_more')}
          disabled={disabled}
          className={styles['fil-toolbar-menu']}
          buttonClassName={styles['fil-toolbar-more-btn']}
        >
          {notRootfolder && (
            <Item>
              <a
                className={styles['fil-action-share']}
                onClick={() => this.setState(toggleShowShareModal)}
              >
                {t('toolbar.share')}
              </a>
            </Item>
          )}
          {canUpload && (
            <Item>
              <UploadButton
                onUpload={files => uploadFiles(files, displayedFolder)}
                label={t('toolbar.menu_upload')}
                className={styles['fil-action-upload']}
              />
            </Item>
          )}
          {actions.addFolder && (
            <Item>
              <a
                className={styles['fil-action-newfolder']}
                onClick={actions.addFolder}
              >
                {t('toolbar.menu_new_folder')}
              </a>
            </Item>
          )}
          {notRootfolder && (
            <Item>
              <a
                className={styles['fil-action-download']}
                onClick={() => downloadAll([displayedFolder])}
              >
                {t('toolbar.menu_download_folder')}
              </a>
            </Item>
          )}
          <hr />
          <Item>
            <a
              className={styles['fil-action-select']}
              onClick={onSelectItemsClick}
            >
              {t('toolbar.menu_select')}
            </a>
          </Item>
        </Menu>
        {this.state.showShareModal && (
          <ShareModal
            document={displayedFolder}
            documentType="Files"
            sharingDesc={displayedFolder.name}
            onClose={() => this.setState(toggleShowShareModal)}
          />
        )}
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  displayedFolder: state.view.displayedFolder
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  uploadFiles: (files, displayedFolder) => {
    dispatch(
      addToUploadQueue(
        files,
        displayedFolder.id,
        file => uploadedFile(file),
        (loaded, quotas, conflicts, errors) => {
          let action = { type: '' } // dummy action, we only use it to trigger an alert notification

          if (quotas.length > 0) {
            // quota errors have their own modal instead of a notification
            alert(<QuotaAlert t={ownProps.t} />)
          } else if (conflicts.length > 0) {
            action.alert = alertShow(
              'upload.alert.success_conflicts',
              { smart_count: loaded.length, conflictNumber: conflicts.length },
              ALERT_LEVEL_INFO
            )
          } else if (errors.length > 0) {
            action.alert = alertShow(
              'upload.alert.errors',
              null,
              ALERT_LEVEL_ERROR
            )
          } else {
            action.alert = alertShow(
              'upload.alert.success',
              { smart_count: loaded.length },
              ALERT_LEVEL_SUCCESS
            )
          }

          return action
        }
      )
    )
  },
  downloadAll: folder => dispatch(downloadFiles(folder))
})

export default translate()(
  connect(mapStateToProps, mapDispatchToProps)(Toolbar)
)
