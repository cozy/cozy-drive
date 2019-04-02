/* global cozy */
/**
 * This component was previously named FileOpener
 * It has been renamed since it is used in :
 *  - an intent handler (aka service)
 *  - via cozydrive://
 */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router'
import get from 'lodash/get'

import { Spinner, Alerter, translate } from 'cozy-ui/react'
import styles from './styles'
import Viewer from 'viewer'

const doNothing = () => {}

const FileNotFoundError = translate()(({ t }) => (
  <pre className="u-error">{t('FileOpenerExternal.fileNotFoundError')}</pre>
))

class FileOpener extends Component {
  state = {
    loading: true,
    file: null
  }
  componentWillMount() {
    if (this.props.fileId) {
      this.loadFileInfo(this.props.fileId)
    } else if (this.props.routeParams.fileId) {
      this.loadFileInfo(this.props.routeParams.fileId)
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.fileId !== this.props.fileId) {
      return this.loadFileInfo(this.props.fileId)
    }
    if (prevProps.routeParams.fileId !== this.props.routeParams.fileId) {
      return this.loadFileInfo(this.props.routeParams.fileId)
    }
  }
  async loadFileInfo(id) {
    try {
      this.setState({ fileNotFound: false })
      const resp = await cozy.client.files.statById(id, false)
      const file = { ...resp, ...resp.attributes, id: resp._id }
      this.setState({ file, loading: false })
    } catch (e) {
      this.setState({ fileNotFound: true, loading: false })
      Alerter.error('alert.could_not_open_file')
    }
  }

  navigateToDrive = () => {
    const parentDir = get(this.state, 'file.dir_id', '')
    this.props.router.push(`/folder/${parentDir}`)
  }

  render() {
    const { file, loading, fileNotFound } = this.state
    const { withCloseButtton = true } = this.props

    return (
      <div className={styles.fileOpener}>
        {loading && <Spinner size="xxlarge" loadingType="message" middle />}
        {fileNotFound && <FileNotFoundError />}
        {!loading &&
          !fileNotFound && (
            <Viewer
              fullscreen={false}
              files={[file]}
              currentIndex={0}
              onChange={doNothing}
              onClose={withCloseButtton ? this.navigateToDrive : null}
            />
          )}
      </div>
    )
  }
}

FileOpener.PropTypes = {
  router: PropTypes.shape({
    push: PropTypes.func.isRequired,
    params: PropTypes.shape({
      fileId: PropTypes.string.isRequired
    }).isRequired
  }).isRequired,
  fileId: PropTypes.number,
  withCloseButtton: PropTypes.bool
}

export default translate()(withRouter(FileOpener))
