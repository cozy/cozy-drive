/* global cozy */

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { flowRight as compose } from 'lodash'

import { Spinner, Modal, translate } from 'cozy-ui/react'

import { getFileDownloadUrl } from '../../actions'
import styles from './styles'

const withAlert = Wrapped =>
  connect(null, dispatch => ({
    alert: data => dispatch({ type: 'ALERT', alert: data })
  }))(Wrapped)

class FileOpener extends Component {
  state = { url: null, loading: false, closing: false }

  componentWillMount() {
    this.openFile()
  }

  async openFile() {
    const { router, params: { fileId }, alert } = this.props
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
    router.push(`/folder/${parent.data.id}`)
  }

  render() {
    const { t } = this.props
    const { closing, loading, url } = this.state
    return (
      <div className={styles.fileOpener}>
        {loading || closing ? (
          <Spinner size="xxlarge" loadingType="message" middle="true" />
        ) : null}
        {url && !closing ? (
          <Modal overflowHidden withCross secondaryAction={this.handleClose}>
            <p className={styles['fileOpener__fallback']}>
              {t('Files.viewer-fallback')}
            </p>
            <iframe
              className={styles['fileOpener__iframe']}
              frameBorder="0"
              src={url}
            />
          </Modal>
        ) : null}
      </div>
    )
  }
}

export default compose(withAlert, translate())(FileOpener)
