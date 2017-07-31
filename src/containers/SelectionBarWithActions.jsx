import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { translate } from 'cozy-ui/react/I18n'

import { openAddToAlbum, removeFromAlbum } from '../ducks/albums'
import { SelectionBar, hideSelectionBar, downloadSelection } from '../ducks/selection'
import { DeleteConfirm, deletePhotos } from '../ducks/timeline'
import Alerter from '../components/Alerter'
import confirm from '../lib/confirm'

const mapDispatchToProps = (dispatch, ownProps) => ({
  actions: {
    'album-add': {
      action: selected => dispatch(openAddToAlbum(selected))
    },
    'download': {
      action: selected => downloadSelection(selected)
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
      displayCondition: () => (ownProps.album !== undefined && ownProps.readOnly === false)
    }
  }
})

export default translate()(withRouter(connect(null, mapDispatchToProps)(SelectionBar)))
