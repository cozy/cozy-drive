/* global cozy */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Spinner from 'cozy-ui/react/Spinner'

import NoNetworkViewer from './NoNetworkViewer'

const TTL = 6000

const LOADING = 'LOADING'
const LOADED = 'LOADED'
const FAILED = 'FAILED'

const withFileUrl = BaseComponent =>
  class withFileUrlClass extends Component {
    state = {
      status: LOADING,
      downloadUrl: null
    }
    static contextTypes = {
          client: PropTypes.object.isRequired
    }
    componentWillMount() {
      this.loadDownloadUrl()
    }

    componentWillReceiveProps(nextProps) {
      if (nextProps.file.id !== this.props.file.id) {
        this.reset()
      }
    }

    componentDidUpdate() {
      if (this.state.status === LOADING && !this.timeout) {
        this.loadDownloadUrl()
      }
    }

    loadDownloadUrl() {
      this.timeout = setTimeout(
        () => this.setState(state => ({ ...state, status: FAILED })),
        TTL
      )
      this.getDownloadLink(this.props.file)
        .then(url => {
          this.clearTimeout()
          this.setState({ downloadUrl: url, status: LOADED })
        })
        .catch(() => {
          this.clearTimeout()
          this.setState(state => ({ ...state, status: FAILED }))
        })
    }

    // for compatibility reasons, we try to use cozy-client but fallback on cozy-client-js
    getDownloadLink(file) {
      return this.context.client
        ? this.context.client
            .collection('io.cozy.files')
            .getDownloadLinkById(file._id)
        : cozy.client.files
            .getDownloadLinkById(file._id)
            .then(path => `${cozy.client._url}${path}`)
    }

    clearTimeout() {
      clearTimeout(this.timeout)
      this.timeout = null
    }

    reset = () => {
      this.setState({ status: LOADING, downloadUrl: null })
    }

    render() {
      if (this.state.status === LOADING) {
        return <Spinner size="xxlarge" middle noMargin color="white" />
      }
      if (this.state.status === FAILED) {
        return <NoNetworkViewer onReload={this.reset} />
      }
      return <BaseComponent {...this.props} url={this.state.downloadUrl} />
    }
  }

export default withFileUrl
