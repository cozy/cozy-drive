/* global cozy */

import styles from '../styles/services'

import React, { Component } from 'react'

import Loading from '../components/Loading'
import ServiceBar from '../components/services/ServiceBar'
import ViewerService from '../components/services/ViewerService'

export default class IntentService extends Component {
  constructor (props, context) {
    super(props, context)
    this.store = context.store

    this.state = {
      isFetching: true,
      fileViewerUrl: null,
      error: null
    }
  }

  componentDidMount () {
    const {window} = this.props
    const intentId = window.location.search.split('=')[1]

    let data
    let intent
    cozy.client.intents.createService(intentId, window)
      .then(service => {
        this.setState({
          service: service
        })

        intent = service.getIntent()
        data = service.getData()

        if (!data || !data._id) {
          throw new Error('Unexpected data from intent')
        }

        return cozy.client.files.getDownloadLinkById(data._id)
      })
      .then(downloadLink => {
        this.setState({
          isFetching: false
        })
        const fullLink = cozy.client._url + downloadLink
        switch (intent.attributes.action) {
          case 'OPEN':
            this.setState({ fileViewerUrl: fullLink })
            break
          case 'GET_URL':
            this.terminate(fullLink)
            break
        }
      })
      .catch(error => {
        this.setState({
          isFetching: false,
          error: {
            message: 'intent.service.initialization.error',
            reason: error.message
          }
        })
      })
  }

  terminate (msg) {
    const { service } = this.state
    service.terminate(msg)
  }

  cancel () {
    const { service } = this.state

    service.cancel
      ? service.cancel()
        : service.terminate(null)
  }

  render () {
    const { isFetching, error, fileViewerUrl } = this.state
    const { t } = this.context

    return (
      <div class={styles['coz-service']}>
        { isFetching &&
          <div class={styles['coz-service-loading']}>
            <Loading />
          </div> }
        { error && <div class={styles['coz-error coz-service-error']}>
          <p>{t(error.message)}</p>
          <p>{t('intent.service.error.cause', {error: error.reason})}</p>
        </div>}
        { !isFetching && !error && fileViewerUrl !== null &&
          <div class={styles['coz-service-layout']}>
            <ServiceBar
              title={'data.cozyAppName'}
              iconPath={'iconpath'}
              onCancel={() => this.cancel()}
              {...this.context}
             />
            <ViewerService
              url={fileViewerUrl}
              {...this.context}
              />
          </div>}
      </div>)
  }
}
