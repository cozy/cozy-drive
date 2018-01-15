/* global cozy */

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { flowRight as compose } from 'lodash'

import { Spinner, translate } from 'cozy-ui/react'
import styles from './styles'

const withAlert = Wrapped =>
  connect(null, dispatch => ({
    alert: data => dispatch({ type: 'ALERT', alert: data })
  }))(Wrapped)

class FileOpener extends Component {
  state = { url: null, loading: false, closing: false }

  componentWillMount() {
    this.redirectToFileViewer()
  }

  async redirectToFileViewer() {
    const { router, params: { fileId }, alert } = this.props

    try {
      const fileInfo = await cozy.client.files.statById(fileId)
      // Go to the parent folder, we replace since we do not want
      // to add a new history entry
      router.replace(`/folder/${fileInfo.attributes.dir_id}/file/${fileId}`)
    } catch (e) {
      console.warn(e)
      // Go to the root folder, we replace since we do not want
      // to add a new history entry
      router.replace('/')
      alert({
        message: 'alert.could_not_open_file'
      })
    }
  }

  render() {
    const { loading } = this.state
    return (
      <div className={styles.fileOpener}>
        {loading ? (
          <Spinner size="xxlarge" loadingType="message" middle="true" />
        ) : null}
      </div>
    )
  }
}

export default compose(withAlert, translate())(FileOpener)
