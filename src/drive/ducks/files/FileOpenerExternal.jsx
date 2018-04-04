/**
 * This component was previously named FileOpener
 * It has been renamed since it is used in :
 *  - an intent handler (aka service)
 *  - via cozydrive://
 */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { flowRight as compose } from 'lodash'

import { Spinner, translate } from 'cozy-ui/react'
import util from 'cozy-ui/stylus/utilities/text'
import styles from './styles'
import Viewer from 'viewer'
import { fetchDocument, getDocument } from 'cozy-client'

const doNothing = () => {}

const FileNotFoundError = translate()(({ t }) => (
  <pre className={util['u-error']}>
    {t('FileOpenerExternal.fileNotFoundError')}
  </pre>
))

class FileOpener extends Component {
  state = { loading: true }
  componentWillMount() {
    this.loadFileInfo()
  }

  async loadFileInfo() {
    const { alert } = this.props
    try {
      this.setState({ fileNotFound: false })

      const res = await this.props.fetchFile()

      if (!res) {
        this.setState({ fileNotFound: true })
      }
    } catch (e) {
      alert({
        message: 'alert.could_not_open_file'
      })
    } finally {
      this.setState({ loading: false })
    }
  }

  render() {
    const { file } = this.props
    const { loading, fileNotFound } = this.state

    return (
      <div className={styles.fileOpener}>
        {loading && <Spinner size="xxlarge" loadingType="message" middle />}
        {fileNotFound && <FileNotFoundError />}
        {!loading &&
          !fileNotFound && (
            <Viewer
              files={[file]}
              currentIndex={0}
              onClose={doNothing}
              onChange={doNothing}
            />
          )}
      </div>
    )
  }
}

const getFileId = ownProps => {
  return ownProps.fileId || ownProps.router.params.fileId
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  alert: data => dispatch({ type: 'ALERT', alert: data }),
  fetchFile: async () => {
    return dispatch(fetchDocument('io.cozy.files', getFileId(ownProps)))
  }
})

const mapStateToProps = (state, ownProps) => ({
  file: getDocument(state, 'io.cozy.files', getFileId(ownProps))
})

FileOpener.PropTypes = {
  router: PropTypes.shape({
    params: PropTypes.shape({
      fileId: PropTypes.string.isRequired
    }).isRequired
  }).isRequired,
  fileId: PropTypes.number
}

export default compose(
  translate(),
  connect(mapStateToProps, mapDispatchToProps)
)(FileOpener)
