/* global cozy */

import { getFileDownloadUrl } from '../../actions'
import { Spinner, Modal } from 'cozy-ui/react'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import styles from './styles'

const withAlert = Wrapped =>
  connect(null, dispatch => ({
    alert: data => dispatch({ type: 'ALERT', alert: data })
  }))(Wrapped)

export default withAlert(
  class extends Component {
    state = { url: null, loading: false, closing: false }

    componentWillMount() {
      this.openFile()
    }

    async openFile() {
      const { router, params: { fileId } } = this.props
      try {
        const url = await getFileDownloadUrl(fileId)
        this.setState({ url })
      } catch (e) {
        router.push('/')
        alert({
          message: 'alert.could_not_open_file'
        })
      } finally {
        this.setState({ loading: false })
      }
    }

    handleClose = async () => {
      this.setState({ closing: true })
      const { router, params: { fileId } } = this.props
      const { relationships: { parent } } = await cozy.client.files.statById(
        fileId
      )

      // Go to the parent folder
      router.push(`/files/${parent.data.id}`)
    }

    render() {
      const { closing, loading, url } = this.state
      return (
        <div className={styles.fileOpener}>
          {loading || closing ? (
            <Spinner size="xxlarge" loadingType="message" middle="true" />
          ) : null}
          {url && !closing ? (
            <Modal overflowHidden withCross secondaryAction={this.handleClose}>
              <iframe frameBorder="0" src={url} />
            </Modal>
          ) : null}
        </div>
      )
    }
  }
)
