/* global cordova */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { openFileWithCordova } from 'drive/mobile/lib/filesystem'
import { getLocalFileCopyUrl } from 'drive/mobile/modules/offline/duck'
import NoViewer from './NoViewer'
import Spinner from 'cozy-ui/react/Spinner'
import classNames from 'classnames'
import { translate } from 'cozy-ui/react/I18n'

import styles from './styles'

const VIEWER_OPTIONS = {
  email: {
    enabled: true
  },
  print: {
    enabled: true
  },
  openWith: {
    enabled: false
  },
  bookmarks: {
    enabled: true
  },
  search: {
    enabled: false
  },
  autoClose: {
    onPause: false
  }
}

class NativePdfViewer extends Component {
  state = {
    opening: true,
    error: null
  }

  onOpen = () => {
    this.setState({ opening: false })
  }

  onClose = () => {
    this.props.onClose()
  }

  onError = e => {
    console.warn(e)
    this.setState({ error: e })
  }

  componentWillMount = async () => {
    try {
      const localFileUrl = await this.props.getLocalFileCopyUrl(this.props.file)
      this.openPdfInExternalViewer(localFileUrl)
    } catch (e) {
      this.onError(e)
    }
  }

  openPdfInExternalViewer = localFileUrl => {
    const { t } = this.props

    cordova.plugins.SitewaertsDocumentViewer.viewDocument(
      localFileUrl,
      'application/pdf',
      {
        ...VIEWER_OPTIONS,
        documentView: {
          closeLabel: t('Viewer.close')
        },
        navigationView: {
          closeLabel: t('Viewer.close')
        },
        title: this.props.file.name
      },
      this.onOpen,
      this.onClose,
      () => this.openPdfWithSystem(localFileUrl),
      this.onError
    )
  }

  openPdfWithSystem = async localFileUrl => {
    try {
      document.addEventListener('resume', this.onSystemPdfViewerExit, false)
      await openFileWithCordova(localFileUrl, 'application/pdf')
      this.onOpen()
    } catch (e) {
      this.onError(e)
    }
  }

  onSystemPdfViewerExit = () => {
    document.removeEventListener('resume', this.onSystemPdfViewerExit)
    this.onClose()
  }

  componentWillUnmount() {
    document.removeEventListener('resume', this.onSystemPdfViewerExit)
  }

  render() {
    const { file } = this.props
    const { opening, error } = this.state

    if (opening && !error)
      return <Spinner size="xxlarge" middle noMargin color="white" />
    else if (error) return <NoViewer file={file} />
    else
      return (
        <div
          className={classNames(
            styles['pho-viewer-noviewer'],
            styles[`pho-viewer-noviewer--${file.class}`]
          )}
        >
          <p className={styles['pho-viewer-filename']}>{file.name}</p>
        </div>
      )
  }
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  getLocalFileCopyUrl: file => dispatch(getLocalFileCopyUrl(file))
})

export default translate()(connect(null, mapDispatchToProps)(NativePdfViewer))
