/* global cozy */
import React, { Component } from 'react'

const getDownloadLink = file =>
  cozy.client.files
    .getDownloadLinkById(file.id)
    .then(path => `${cozy.client._url}${path}`)

const TTL = 6000

const LOADING = 'LOADING'
const LOADED = 'LOADED'
const PENDING = 'PENDING'
const FAILED = 'FAILED'

// This component handles the load and display of an image fetched from the cozy-stack:
// It first tries to load the provided `src` (it should be the link to a thumbnail) ;
// If it fails, it tries to fetch the download url for the provided `photo`, and then
// it tries to load the raw image. If one of these image loadings (done by instantiating an `Image`)
// is successful, the image is shown.
export default class ImageLoader extends Component {
  state = {
    fallbackUrl: null,
    primaryStatus: LOADING,
    fallbackStatus: PENDING
  }

  isLoadingPrimary() {
    return this.state.primaryStatus === LOADING
  }
  shouldLoadPrimary() {
    return this.isLoadingPrimary() && !this.img
  }
  isPrimaryLoaded() {
    return this.state.primaryStatus === LOADED
  }
  isLoadingFallback() {
    return (
      this.state.primaryStatus === FAILED &&
      this.state.fallbackStatus === LOADING
    )
  }
  shouldLoadFallbackUrl() {
    return this.isLoadingFallback() && !this.state.fallbackUrl
  }
  shouldLoadFallback() {
    return this.isLoadingFallback() && this.state.fallbackUrl && !this.img
  }
  isFallbackLoaded() {
    return this.state.fallbackStatus === LOADED
  }
  hasSomethingToShow() {
    return this.isPrimaryLoaded() || this.isFallbackLoaded()
  }

  componentDidMount() {
    if (this.shouldLoadPrimary()) {
      this.createLoader(this.props.src)
    }
  }

  // If the component is reused to display another image, we reset the state so that
  // `componentWillUpdate` gets triggered
  componentWillReceiveProps(nextProps) {
    if (this.props.src !== nextProps.src) {
      this.setState(state => ({
        primaryStatus: nextProps.src ? LOADING : PENDING,
        fallbackUrl: null,
        fallbackStatus: PENDING
      }))
    }
  }

  // Here is the main logic: depending on the state, we trigger the different fetch we need
  componentDidUpdate() {
    if (this.shouldLoadPrimary()) {
      this.createLoader(this.props.src)
    } else if (this.shouldLoadFallbackUrl()) {
      this.getDownloadLink(this.props.photo)
        .then(url => this.setState(state => ({ ...state, fallbackUrl: url })))
        .catch(error => this.allIsLost(error))
    } else if (this.shouldLoadFallback()) {
      this.createLoader(this.state.fallbackUrl)
    }
  }

  // for compatibility reasons, we try to use cozy-client but fallback on cozy-client-js
  getDownloadLink(photo) {
    return this.context.client
      ? this.context.client
          .collection('io.cozy.files')
          .getDownloadLinkById(photo._id)
      : getDownloadLink(photo)
  }

  componentWillUnmount() {
    this.destroyLoader()
  }

  createLoader(src) {
    this.destroyLoader()
    this.img = new Image()
    this.img.onload = this.handleLoad
    this.img.onerror = this.handleError
    this.img.src = src
    this.timeout = setTimeout(this.allIsLost, TTL)
  }

  destroyLoader() {
    clearTimeout(this.timeout)
    if (this.img) {
      this.img.onload = null
      this.img.onerror = null
      this.img = null
    }
  }

  handleLoad = event => {
    this.destroyLoader()
    if (this.isLoadingPrimary()) {
      this.setState(state => ({ ...state, primaryStatus: LOADED }))
    } else {
      this.setState(state => ({ ...state, fallbackStatus: LOADED }))
    }
    if (this.props.onLoad) this.props.onLoad(event)
  }

  handleError = error => {
    this.destroyLoader()
    if (this.isLoadingPrimary()) {
      this.setState(state => ({
        ...state,
        primaryStatus: FAILED,
        fallbackStatus: LOADING
      }))
    } else {
      this.allIsLost(error)
    }
  }

  allIsLost = error => {
    // As this method can be called in 3 different contexts, we have to ensure a coherent state
    this.destroyLoader()
    this.setState(state => ({
      ...state,
      primaryStatus: FAILED,
      fallbackStatus: FAILED
    }))
    if (this.props.onError) this.props.onError(error)
  }

  render() {
    if (this.hasSomethingToShow()) {
      const { photo, src, alt, className, style = {} } = this.props
      const loadedSource = this.isPrimaryLoaded() ? src : this.state.fallbackUrl
      return (
        <img
          ref={img => {
            this.img = img
          }}
          className={className}
          style={Object.assign({}, style)}
          alt={alt || photo.name}
          src={loadedSource}
        />
      )
    } else if (
      this.props.preloader &&
      typeof this.props.preloader === 'function'
    ) {
      return this.props.preloader(this.props)
    }
  }
}
