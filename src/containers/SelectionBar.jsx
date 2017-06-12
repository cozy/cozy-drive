import styles from '../styles/selectionbar'

import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import classNames from 'classnames'
import { translate } from 'cozy-ui/react/I18n'

import Alerter from '../components/Alerter'
import { hideSelectionBar } from '../actions/selection'

import { getAlbum, openAddToAlbum, removeFromAlbum } from '../ducks/albums'

const SelectionBar = ({ t, selected, selectedCount, album, onHide, onAddToAlbum, onRemoveFromAlbum, router }) => (
  <div
    className={classNames(styles['coz-selectionbar'], {
      [styles['coz-selectionbar--active']]: selectedCount !== 0
    })}
    role='toolbar'
  >
    <span className={styles['coz-selectionbar-count']}>
      {t('SelectionBar.selected_count', { smart_count: selectedCount })}
    </span>
    <span className={styles['coz-selectionbar-separator']} />
    <button
      disabled={selectedCount === 0}
      className={styles['coz-action-album-add']}
      onClick={() => onAddToAlbum(selected)}
    >
      {t('SelectionBar.add_to_album')}
    </button>
    {router.location.pathname.startsWith('/albums') &&
    <button
      disabled={selectedCount === 0}
      className={styles['coz-action-album-remove']}
      onClick={() => onRemoveFromAlbum(selected, album)}
    >
      {t('SelectionBar.remove_from_album')}
    </button>
    }
    <button className={styles['coz-action-close']} onClick={onHide}>
      {t('SelectionBar.close')}
    </button>
  </div>
)

const mapStateToProps = (state, ownProps) => ({
  selected: state.ui.selected,
  selectedCount: state.ui.selected.length,
  album: ownProps.params.albumId ? getAlbum(state, ownProps.params.albumId) : null
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  onHide: () => dispatch(hideSelectionBar()),
  onAddToAlbum: selected => dispatch(openAddToAlbum(selected)),
  onRemoveFromAlbum: (selected, album) =>
  dispatch(removeFromAlbum(album, selected))
   .then(() => Alerter.success('Albums.remove_photos.success', { album_name: album.name }))
   .catch(() => Alerter.error('Albums.remove_photos.error.generic'))
})

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(translate()(SelectionBar)))
