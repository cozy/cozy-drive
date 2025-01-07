/* global cozy */
/**
 * This component was previously named FileOpener
 * It has been renamed since it is used in :
 *  - an intent handler (aka service)
 *  - via cozydrive://
 */

import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { RemoveScroll } from 'react-remove-scroll'
import { useNavigate, useParams } from 'react-router-dom'

import Spinner from 'cozy-ui/transpiled/react/Spinner'
import { useAlert } from 'cozy-ui/transpiled/react/providers/Alert'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'
import { translate, useI18n } from 'cozy-ui/transpiled/react/providers/I18n'
import Viewer, {
  FooterActionButtons,
  ForwardOrDownloadButton,
  ToolbarButtons,
  SharingButton
} from 'cozy-viewer'

import Fallback from '@/modules/viewer/Fallback'
import {
  isOfficeEnabled,
  makeOnlyOfficeFileRoute
} from '@/modules/views/OnlyOffice/helpers'

const FileNotFoundError = translate()(({ t }) => (
  <pre className="u-error">{t('FileOpenerExternal.fileNotFoundError')}</pre>
))

export class FileOpener extends Component {
  state = {
    loading: true,
    file: null
  }
  UNSAFE_componentWillMount() {
    if (this.props.fileId) {
      this.loadFileInfo(this.props.fileId)
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.fileId !== this.props.fileId) {
      return this.loadFileInfo(this.props.fileId)
    }
  }

  async loadFileInfo(id) {
    const { showAlert, t } = this.props
    try {
      this.setState({ fileNotFound: false })
      const resp = await cozy.client.files.statById(id, false)
      const file = { ...resp, ...resp.attributes, id: resp._id }
      this.setState({ file, loading: false })
    } catch (e) {
      this.setState({ fileNotFound: true, loading: false })
      showAlert({
        message: t('alert.could_not_open_file')
      })
    }
  }

  render() {
    const { file, loading, fileNotFound } = this.state
    const {
      t,
      service,
      navigate,
      breakpoints: { isDesktop }
    } = this.props

    return (
      <div className="u-pos-absolute u-w-100 u-h-100 u-bg-charcoalGrey">
        {loading && <Spinner size="xxlarge" middle noMargin color="white" />}
        {fileNotFound && <FileNotFoundError />}
        {!loading && !fileNotFound && (
          <RemoveScroll>
            <Viewer
              files={[file]}
              currentIndex={0}
              onChangeRequest={() => {}}
              onCloseRequest={service ? () => service.terminate() : null}
              renderFallbackExtraContent={file => (
                <Fallback file={file} t={t} />
              )}
              componentsProps={{
                OnlyOfficeViewer: {
                  isEnabled: isOfficeEnabled(isDesktop),
                  opener: file => navigate(makeOnlyOfficeFileRoute(file.id))
                }
              }}
            >
              <ToolbarButtons>
                <SharingButton variant="iconButton" />
              </ToolbarButtons>
              <FooterActionButtons>
                <SharingButton />
                <ForwardOrDownloadButton variant="buttonIcon" />
              </FooterActionButtons>
            </Viewer>
          </RemoveScroll>
        )}
      </div>
    )
  }
}

FileOpener.propTypes = {
  fileId: PropTypes.string.isRequired,
  service: PropTypes.object
}

const FileOpenerWrapper = props => {
  const navigate = useNavigate()
  const breakpoints = useBreakpoints()
  const { t } = useI18n()
  const { fileId } = useParams()
  const { showAlert } = useAlert()

  return (
    <FileOpener
      breakpoints={breakpoints}
      t={t}
      fileId={fileId}
      navigate={navigate}
      showAlert={showAlert}
      {...props}
    />
  )
}

export default FileOpenerWrapper
