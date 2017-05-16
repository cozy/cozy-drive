import styles from '../styles/share'

import React from 'react'
import { connect } from 'react-redux'
import { translate } from '../lib/I18n'
import Modal from 'cozy-ui/react/Modal'
import Toggle from 'cozy-ui/react/Toggle'
import classNames from 'classnames'

import { cancelShare } from '../ducks/albums'

export const ShareModal = props => {
  const {
    t,
    onDismiss
  } = props
  return (
    <Modal
      title={t('Albums.share.title')}
      secondaryAction={() => onDismiss()}
      >
      <div className={classNames(styles['coz-modal-section'])}>
        <div className={styles['coz-form']}>
          <h3>{t('Albums.share.shareByLink.title')}</h3>
          <div className={styles['pho-input-dual']}>
            <div><label for='' className={styles['coz-form-desc']}>{t('Albums.share.shareByLink.desc')}</label></div>
            <div><Toggle /></div>
          </div>
        </div>
        <div className={styles['coz-form']}>
          <h4>{t('Albums.share.sharingLink.title')}</h4>
          <div className={styles['pho-input-dual']}>
            <div><input type='text' name='' id='' value='https://georgeabitb.ol/vXppj4eSrCRn…' /></div>
            <div><button className={classNames('coz-btn', 'coz-btn--secondary', styles['pho-btn-copy'])}>{t('Albums.share.sharingLink.copy')}</button></div>
          </div>
        </div>
        <div className={styles['coz-form']}>
          <h3>{t('Albums.share.protectedShare.title')}</h3>
          <div className={styles['coz-form-desc']}>{t('Albums.share.protectedShare.desc')}</div>
        </div>
      </div>
    </Modal>
  )
}

const mapStateToProps = (state, ownProps) => {
  return {
    photos: state.ui.selected,
    mangoIndex: state.mango.albumsIndexByName
  }
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  onDismiss: () => {
    dispatch(cancelShare())
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(translate()(ShareModal))
