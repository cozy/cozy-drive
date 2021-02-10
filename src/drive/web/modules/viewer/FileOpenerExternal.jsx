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

import { Spinner, Alerter, translate } from 'cozy-ui/transpiled/react'
import { Viewer } from 'cozy-ui/transpiled/react'
import styles from 'drive/web/modules/viewer/barviewer.styl'
import Fallback from 'drive/web/modules/viewer/Fallback'

const doNothing = () => {}

const FileNotFoundError = translate()(({ t }) => (
  <pre className="u-error">{t('FileOpenerExternal.fileNotFoundError')}</pre>
))

export class FileOpener extends Component {
  state = {
    loading: true,
    file: null
  }
  componentWillMount() {
    const routerFileId = get(this.props, 'routeParams.fileId')
    if (this.props.fileId) {
      this.loadFileInfo(this.props.fileId)
    } else if (routerFileId) {
      this.loadFileInfo(routerFileId)
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.fileId !== this.props.fileId) {
      return this.loadFileInfo(this.props.fileId)
    }
    const previousRouterFileId = get(prevProps, 'routeParams.fileId')
    const routerFileId = get(this.props, 'routeParams.fileId')
    if (previousRouterFileId !== routerFileId) {
      return this.loadFileInfo(routerFileId)
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

  render() {
    const { file, loading, fileNotFound } = this.state
    const { t } = this.props

    return (
      <div className={styles['viewer-wrapper-with-bar']}>
        {loading && <Spinner size="xxlarge" loadingType="message" middle />}
        {fileNotFound && <FileNotFoundError />}
        {!loading &&
          !fileNotFound && (
            <Viewer
              files={[file]}
              currentIndex={0}
              onChangeRequest={doNothing}
              onCloseRequest={null}
              renderFallbackExtraContent={file => (
                <Fallback file={file} t={t} />
              )}
            />
          )}
      </div>
    )
  }
}

FileOpener.propTypes = {
  router: PropTypes.shape({
    push: PropTypes.func.isRequired,
    params: PropTypes.shape({
      fileId: PropTypes.string.isRequired
    }).isRequired
  }),
  routeParams: PropTypes.shape({
    fileId: PropTypes.string
  }),
  fileId: PropTypes.string
}

export default translate()(withRouter(FileOpener))
