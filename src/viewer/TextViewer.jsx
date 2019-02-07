import React from 'react'

import withFileUrl from './withFileUrl'
import styles from './styles'
import cx from 'classnames'
import Spinner from 'cozy-ui/react/Spinner'
import NoViewer from './NoViewer'

class TextViewer extends React.Component {
  state = {
    text: '',
    loading: true,
    error: null
  }

  componentDidMount() {
    this.loadFile()
  }

  async loadFile() {
    const { url } = this.props
    try {
      const parsedURL = new URL(url)
      const client = this.context.client.getClient()
      const response = await client.fetch('GET', parsedURL.pathname)
      const text = await response.text()
      this.setState({
        text,
        loading: false
      })
    } catch (error) {
      this.setState({
        loading: false,
        error
      })
    }
  }

  render() {
    const { loading, error, text } = this.state
    const { url, file } = this.props

    if (loading)
      return (
        <div className={styles['pho-viewer-textviewer']}>
          <Spinner size="xxlarge" middle noMargin color="white" />
        </div>
      )
    else if (error) return <NoViewer file={file} fallbackUrl={url} />
    else
      return (
        <div className={styles['pho-viewer-textviewer']}>
          <h2 className={cx(styles['pho-viewer-filename'], 'u-mt-2', 'u-mb-1')}>
            {file.name}
          </h2>
          <pre className="u-mh-auto u-mv-2">{text}</pre>
        </div>
      )
  }
}

export default withFileUrl(TextViewer)
