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
import { RemoveScroll } from 'react-remove-scroll'

import Spinner from 'cozy-ui/transpiled/react/Spinner'
import Alerter from 'cozy-ui/transpiled/react/Alerter'
import { translate } from 'cozy-ui/transpiled/react/I18n'
import Viewer from 'cozy-ui/transpiled/react/Viewer'
import Overlay from 'cozy-ui/transpiled/react/Overlay'

import Fallback from 'drive/web/modules/viewer/Fallback'
import {
  isOnlyOfficeEnabled,
  makeOnlyOfficeFileRoute
} from 'drive/web/modules/views/OnlyOffice/helpers'

const FileNotFoundError = translate()(({ t }) => (
  <pre className="u-error">{t('FileOpenerExternal.fileNotFoundError')}</pre>
))

export class FileOpener extends Component {
  state = {
    loading: true,
    file: null
  }
  UNSAFE_componentWillMount() {
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
    const { t, service, router } = this.props

    return (
      <div className="u-pos-absolute u-w-100 u-h-100 u-bg-charcoalGrey">
        {loading && <Spinner size="xxlarge" middle noMargin color="white" />}
        {fileNotFound && <FileNotFoundError />}
        {!loading && !fileNotFound && (
          <RemoveScroll>
            <Overlay>
              <Viewer
                files={[file]}
                currentIndex={0}
                onChangeRequest={() => {}}
                onCloseRequest={() => service.terminate()}
                renderFallbackExtraContent={file => (
                  <Fallback file={file} t={t} />
                )}
                onlyOfficeProps={{
                  isEnabled: isOnlyOfficeEnabled(),
                  opener: file =>
                    router.push(makeOnlyOfficeFileRoute(file, true))
                }}
              />
            </Overlay>
          </RemoveScroll>
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
