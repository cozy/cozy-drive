import styles from '../styles/photo'

import React, { Component } from 'react'
import { Link, withRouter } from 'react-router'

import { getPhotoLink } from '../actions/photos'

export class Photo extends Component {
  constructor (props) {
    super(props)

    this.state = {
      loading: true
    }
    getPhotoLink(props.photo)
      .then(link => this.setState({
        url: link,
        loading: false
      }))
  }

  render () {
    const { photo, router } = this.props
    const { loading, url } = this.state
    const parentPath = router.location.pathname
    return (
      !loading &&
        <Link to={`${parentPath}/${photo._id}`}>
          <img
            className={styles['pho-photo-item']}
            src={url}
          />
        </Link>
    )
  }
}

export default withRouter(Photo)
