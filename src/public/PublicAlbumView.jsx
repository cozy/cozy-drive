/* global cozy */
import React from 'react'

import { ALBUM_DOCTYPE } from '../constants/config'
import { getPhotoLink } from '../actions/photos'
import PhotosList from './PhotosList'

const addUrl = async photo => ({
  ...photo,
  url: await getPhotoLink(photo._id)
})

class PublicAlbumView extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      photos: []
    }
  }

  addAll (photos) {
    this.setState(state => ({ state, photos }))
  }

  async componentDidMount () {
    const { id } = this.props
    const album = {
      _type: ALBUM_DOCTYPE,
      _id: id
    }

    try {
      const photosIds = await cozy.client.data.listReferencedFiles(album)
      const photos = await Promise.all(photosIds.map(cozy.client.files.statById))
      const photosWithUrl = await Promise.all(photos.map(addUrl))
      this.setState(state => ({ ...state, photos: photosWithUrl }))

      const document = await cozy.client.data.find(ALBUM_DOCTYPE, id)
      this.setState(state => ({ ...state, name: document.name }))
    } catch (ex) {
      console.error(ex, this.state)
    }
  }

  render () {
    return (
      <div>
        <h3>{this.state.name}</h3>
        <PhotosList photos={this.state.photos} />
      </div>
    )
  }
}

export default PublicAlbumView
