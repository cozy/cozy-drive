import styles from '../styles/photoList'

import React, { Component } from 'react'
import { Button } from 'cozy-ui/react'
import { translate } from 'cozy-ui/react/I18n'

const Spinner = () => <div className={styles['pho-list-spinner']} />

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
    const { t, width = '100%' } = this.props
    const { fetching } = this.state
    return (
      <div style={{ width: width }} className={styles['pho-list-morebutton']}>
        {fetching && (
          <Button disabled theme="secondary" label={<Spinner nomargin />} />
        )}
        {!fetching && (
          <Button
            theme="secondary"
            onClick={() => this.handleClick()}
            label={t('Board.load_more')}
          />
        )}
      </div>
    )
  }
}

export default translate()(LoadMoreButton)
