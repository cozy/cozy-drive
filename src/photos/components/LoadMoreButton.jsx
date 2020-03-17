import styles from '../styles/photoList.styl'

import React, { Component } from 'react'
import Button from 'cozy-ui/transpiled/react/Button'
import Spinner from 'cozy-ui/transpiled/react/Spinner'
import palette from 'cozy-ui/stylus/settings/palette.json'

class LoadMoreButton extends Component {
  constructor(props) {
    super(props)
    this.state = {
      fetching: false
    }
  }

  handleClick() {
    this.setState({ fetching: true })
    this.props.onClick().then(() => this.setState({ fetching: false }))
  }

  render() {
    const { label, width = '100%' } = this.props
    const { fetching } = this.state
    return (
      <div style={{ width: width }} className={styles['pho-list-morebutton']}>
        {fetching && (
          <Button
            disabled
            theme="secondary"
            label={<Spinner color={palette['dodgerBlue']} nomargin />}
          />
        )}
        {!fetching && (
          <Button
            theme="secondary"
            onClick={() => this.handleClick()}
            label={label}
          />
        )}
      </div>
    )
  }
}

export default LoadMoreButton
