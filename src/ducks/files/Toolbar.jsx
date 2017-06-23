import styles from '../../styles/toolbar'
import classNames from 'classnames'

import React from 'react'
import { connect } from 'react-redux'
import { translate } from 'cozy-ui/react/I18n'

import UploadButton from '../../components/UploadButton'
import Menu, { Item } from '../../components/Menu'
import QuotaAlert from '../../components/QuotaAlert'
import { alert } from '../../lib/confirm'
import { alertShow } from 'cozy-ui/react/Alerter'

import { addToUploadQueue } from '../upload'
import { uploadedFile } from '../../actions'

const ALERT_LEVEL_INFO = 'info'
const ALERT_LEVEL_ERROR = 'error'
const ALERT_LEVEL_SUCCESS = 'success'

const Toolbar = ({ t, disabled, displayedFolder, actions, onSelectItemsClick, uploadFiles }) => (
  <div className={styles['fil-toolbar-files']} role='toolbar'>
    <UploadButton
      disabled={disabled}
      onUpload={files => uploadFiles(files, displayedFolder)}
      label={t('toolbar.item_upload')}
      className={classNames('coz-btn', 'coz-btn--regular', 'coz-btn--upload', styles['desktop-upload'])}
    />
    <Menu
      title={t('toolbar.item_more')}
      disabled={disabled}
      className={styles['fil-toolbar-menu']}
      buttonClassName={styles['fil-toolbar-more-btn']}
    >
      <Item>
        <UploadButton
          onUpload={files => uploadFiles(files, displayedFolder)}
          label={t('toolbar.menu_upload')}
          className={styles['fil-action-upload']}
        />
      </Item>
      <Item>
        <a
          className={styles['fil-action-newfolder']}
          onClick={actions.addFolder}
        >
          {t('toolbar.menu_new_folder')}
        </a>
      </Item>
      <hr />
      <Item>
        <a className={styles['fil-action-select']} onClick={onSelectItemsClick}>
          {t('toolbar.menu_select')}
        </a>
      </Item>
    </Menu>
  </div>
)

const mapStateToProps = (state, ownProps) => ({
  displayedFolder: state.view.displayedFolder
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  uploadFiles: (files, displayedFolder) => {
    dispatch(addToUploadQueue(files, displayedFolder._id, file => uploadedFile(file), (loaded, quotas, conflicts, errors) => {
      let action = { type: '' }// dummy action, we only use it to trigger an alert notification

      if (quotas.length > 0) {
        // quota errors have their own modal instead of a notification
        alert(<QuotaAlert t={ownProps.t} />)
      }
      else if (conflicts.length > 0) {
        action.alert = alertShow('upload.alert.success_conflicts', {smart_count: loaded.length, conflictNumber: conflicts.length}, ALERT_LEVEL_INFO)
      }
      else if (errors.length > 0) {
        action.alert = alertShow('upload.alert.errors', null, ALERT_LEVEL_ERROR)
      }
      else {
        action.alert = alertShow('upload.alert.success', {smart_count: loaded.length}, ALERT_LEVEL_SUCCESS)
      }

      return action
    }))
  }
})

export default translate()(connect(
  mapStateToProps,
  mapDispatchToProps
)(Toolbar))
