import styles from '../../styles/toolbar'
import classNames from 'classnames'

import React from 'react'
import { connect } from 'react-redux'
import { translate } from '../../lib/I18n'

import UploadButton from '../../components/UploadButton'
import Menu, { Item } from '../../components/Menu'
import QuotaAlert from '../../components/QuotaAlert'
import { alert } from '../../lib/confirm'

import { uploadFile } from '../../actions'

const Toolbar = ({ t, disabled, displayedFolder, actions, onSelectItemsClick, uploadFile }) => (
  <div className={styles['fil-toolbar-files']} role='toolbar'>
    <UploadButton
      disabled={disabled}
      onUpload={file => uploadFile(file, displayedFolder)}
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
          onUpload={file => uploadFile(file, displayedFolder)}
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
  uploadFile: (file, displayedFolder) => {
    dispatch(uploadFile(file, displayedFolder))
      .catch(err => {
        if (err.response && err.response.status === 413) {
          alert(<QuotaAlert t={ownProps.t} />)
        }
      })
  }
})

export default translate()(connect(
  mapStateToProps,
  mapDispatchToProps
)(Toolbar))
