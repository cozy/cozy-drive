import React from 'react'
import ReactMarkdown from 'react-markdown'
import PropTypes from 'prop-types'
import cx from 'classnames'
import Spinner from 'cozy-ui/react/Spinner'
import withFileUrl from './withFileUrl'
import styles from './styles'
import NoViewer from './NoViewer'

const MarkdownRenderer = ({ text }) => (
  <ReactMarkdown
    className={cx(styles['pho-viewer-textviewer-content'], 'u-p-1')}
    source={text}
  />
)

const PlainTextRenderer = ({ text }) => (
  <pre
    className={cx(
      styles['pho-viewer-textviewer-content'],
      'u-mh-auto',
      'u-mv-2'
    )}
  >
    {text}
  </pre>
)

const Loader = () => (
  <div className={styles['pho-viewer-textviewer']}>
    <Spinner size="xxlarge" middle noMargin color="white" />
  </div>
)

class TextViewer extends React.Component {
  state = {
    text: '',
    isMarkdown: false,
    loading: true,
    error: null
  }

  static contextTypes = {
    client: PropTypes.object.isRequired
  }

  _mounted = false

  componentDidMount() {
    this._mounted = true
    this.loadFile()
  }

  componentWillUnmount() {
    this._mounted = false
  }

  async loadFile() {
    const { url, file } = this.props
    try {
      const parsedURL = new URL(url)
      const client = this.context.client.getClient()
      const response = await client.fetch('GET', parsedURL.pathname)
      const text = await response.text()
      const isMarkdown = file.mime === 'text/markdown' || /.md$/.test(file.name)
      if (this._mounted) {
        this.setState({
          text,
          isMarkdown,
          loading: false
        })
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn(error)
      if (this._mounted) {
        this.setState({
          loading: false,
          error
        })
      }
    }
  }

  render() {
    const { loading, error, text, isMarkdown } = this.state
    const { url, file } = this.props

    if (loading) return <Loader />
    else if (error) return <NoViewer file={file} fallbackUrl={url} />
    else
      return (
        <div
          data-test-id="viewer-text"
          className={styles['pho-viewer-textviewer']}
        >
          <h2 className={cx(styles['pho-viewer-filename'], 'u-mt-3', 'u-mb-1')}>
            {file.name}
          </h2>
          {isMarkdown ? (
            <MarkdownRenderer text={text} />
          ) : (
            <PlainTextRenderer text={text} />
          )}
        </div>
      )
  }
}

export default withFileUrl(TextViewer)
