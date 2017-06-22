import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { translate } from 'cozy-ui/react/I18n'

import { openAddToAlbum, removeFromAlbum } from '../features/albums'
import { SelectionBar, hideSelectionBar } from '../ducks/selection'
import Alerter from '../components/Alerter'
import confirm from '../lib/confirm'
import { DeleteConfirm, deletePhotos } from '../ducks/timeline'

const mapDispatchToProps = (dispatch, ownProps) => ({
  actions: {
    'album-add': {
      action: selected => dispatch(openAddToAlbum(selected))
    },
    'delete': {
      action: selected => confirm(<DeleteConfirm t={ownProps.t} count={selected.length} related={ownProps.related} />,
        () => dispatch(deletePhotos(selected))
      ),
      displayCondition: () => ownProps.router.location.pathname.startsWith('/photos')
    },
    'album-remove': {
      action: selected => dispatch(removeFromAlbum(ownProps.album, selected))
        .then(() => {
          Alerter.success('Albums.remove_photos.success', { album_name: ownProps.album.name })
          // TODO: we should find a better way, perhaps closing the bar by default on action success,
          // and provide an optional 'cancelSelectionOnSuccess' option for the bar actions
          dispatch(hideSelectionBar())
        })
        .catch(() => Alerter.error('Albums.remove_photos.error.generic')),
      displayCondition: () => ownProps.album !== undefined
    }
  }
})

export default translate()(withRouter(connect(null, mapDispatchToProps)(SelectionBar)))
