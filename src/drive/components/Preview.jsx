/* global cozy */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styles from '../styles/table'

const TTL = 6000

const PENDING = 'PENDING'
const LOADING_LINK = 'LOADING_LINK'
const LOADING_FALLBACK = 'LOADING_FALLBACK'
const LOADED = 'LOADED'
const FAILED = 'FAILED'

class Preview extends Component {
  state = {
    status: PENDING,
    src: null
  }

  componentDidMount() {
    this.loadNextSrc()
  }

  loadNextSrc(lastError = null) {
    const { status } = this.state

    if (status === PENDING) this.loadLink()
    else if (status === LOADING_LINK) this.loadFallback()
    else if (status === LOADING_FALLBACK) {
      this.setState({ status: FAILED })
      this.props.onError(lastError)
    }
  }

  checkImageSource(src) {
    return new Promise((resolve, reject) => {
      this.img = new Image()
      this.img.onload = resolve
      this.img.onerror = reject
      this.img.src = src
      this.timeout = setTimeout(reject, TTL)
    })
  }

  async getFileLink(file) {
    if (file.links) return file.links
    else {
      const response = await cozy.client.files.statById(
        file.id || file._id,
        false
      )
      if (!response.links) throw new Error('Could not fetch file links')
      return response.links
    }
  }

  async loadLink() {
    this.setState({ status: LOADING_LINK })
    const { file, size } = this.props
    const { client } = this.context

    try {
      const links = await this.getFileLinks(file, size)
      const link = links[size]

      if (!link) throw new Error(`${size} link is not available`)

      const src = client.options.uri + link
      await this.checkImageSource(src)
      this.setState({
        status: LOADED,
        src
      })
    } catch (e) {
      this.loadNextSrc(e)
    }
  }

  async loadFallback() {
    this.setState({ status: LOADING_FALLBACK })
    const { file } = this.props

    try {
      const src = await this.getDownloadLink(file.id || file._id)
      await this.checkImageSource(src)
      this.setState({
        status: LOADED,
        src
      })
    } catch (e) {
      this.loadNextSrc(e)
    }
  }

  getDownloadLink(fileId) {
    return this.context.client
      ? this.context.client
          .collection('io.cozy.files')
          .getDownloadLinkById(fileId)
      : cozy.client.files
          .getDownloadLinkById(fileId)
          .then(path => `${cozy.client._url}${path}`)
  }

  render() {
    const { src } = this.state
    return (
      <div
        className={styles['fil-file-preview']}
        style={`background-image: url(${src});`}
      />
    )
  }
}

Preview.propTypes = {
  file: PropTypes.object.isRequired,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  onError: PropTypes.func
}

Preview.defaultProps = {
  size: 'small',
  onError: () => {}
}

export default Preview
