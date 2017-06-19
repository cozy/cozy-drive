/* global cozy */
import React, { Component } from 'react'

// Extreme fallback: returns a direct download link to the raw image
const getPhotoLink = async (photoId) => {
  return await cozy.client.files.getDownloadLinkById(photoId)
    .then(path => `${cozy.client._url}${path}`)
}

export default class ImageLoader extends Component {
  state = {
    loading: true,
    fallback: null
  }

  onLoad = () => {
    this.setState({ loading: false })
    if (this.props.onLoad) this.props.onLoad()
  }

  onError = () => {
    if (!this.img) return // if we already unmounted
    if (this.state.fallback && this.img.src === this.state.fallback) return
    // extreme fallback
    getPhotoLink(this.props.photo._id)
      .then(url => {
        this.img.src = url
        this.setState({ loading: false, fallback: url })
        if (this.props.onLoad) this.props.onLoad()
      })
  }

  componentWillUnmount () {
    // this is needed because when opening 2 times in a row the same photo in the viewer,
    // the second time the onLoad is not fired... This will fire the onError (see above)
    this.img.src = ''
  }

  render () {
    const { photo, src, alt, className, style = {} } = this.props
    const { loading } = this.state
    return (
      <img
        ref={img => { this.img = img }}
        className={className}
        onLoad={this.onLoad}
        onError={this.onError}
        style={Object.assign({}, style)}
        alt={alt || photo.name}
        src={src}
      />
    )
  }
}
