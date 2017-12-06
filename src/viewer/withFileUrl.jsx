import React, { Component } from 'react'
import { getDownloadLink } from 'cozy-client'
import Spinner from 'cozy-ui/react/Spinner'

import NoNetwork from './NoNetwork'

const TTL = 6000

const LOADING = 'LOADING'
const LOADED = 'LOADED'
const FAILED = 'FAILED'

const withFileUrl = WrappedComponent =>
  class Wrapper extends Component {
    state = {
      status: LOADING,
      downloadUrl: null
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
      getDownloadLink(this.props.file)
        .then(url => {
          this.clearTimeout()
          this.setState(state => ({ downloadUrl: url, status: LOADED }))
        })
        .catch(() => {
          this.clearTimeout()
          this.setState(state => ({ ...state, status: FAILED }))
        })
    }

    clearTimeout() {
      clearTimeout(this.timeout)
      this.timeout = null
    }

    reset = () => {
      this.setState(state => ({ status: LOADING, downloadUrl: null }))
    }

    render() {
      if (this.state.status === LOADING) {
        return <Spinner size="xxlarge" middle="true" noMargin color="white" />
      }
      if (this.state.status === FAILED) {
        return <NoNetwork onReload={this.reset} />
      }
      return <WrappedComponent {...this.props} url={this.state.downloadUrl} />
    }
  }

export default withFileUrl
