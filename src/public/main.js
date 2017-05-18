/* global cozy */

import React from 'react'
import { render } from 'react-dom'
import justifiedLayout from 'justified-layout'

import { getPhotoLink } from '../actions/photos'

import { ALBUM_DOCTYPE } from '../constants/config'

document.addEventListener('DOMContentLoaded', init)

const arrToObj = (obj = {}, varval = ['var', 'val']) => {
  obj[varval[0]] = varval[1]
  return obj
}

const getQueryParameter = () => window
  .location
  .search
  .substring(1)
  .split('&')
  .map(varval => varval.split('='))
  .reduce(arrToObj, {})

const addUrl = async photo => ({
  ...photo,
  url: await getPhotoLink(photo._id)
})

const getStyle = box => ({
  width: `${box.width}px`,
  height: `${box.height}px`,
  top: `${box.top}px`,
  left: `${box.left}px`,
  position: 'absolute'
})

const toBox = photo => ({
  width: photo.attributes.metadata.width,
  height: photo.attributes.metadata.height
})

const PhotoList = ({photos}) => {
  const layout = justifiedLayout(photos.map(toBox))
  const boxes = layout.boxes.map((box, index) => (
    <img style={getStyle(box)} src={photos[index].url} />
  ))
  return <div style={{position: 'relative'}}>{boxes}</div>
}

class App extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      photos: []
    }
  }

  addAll (photos) {
    this.setState(state => ({ state, photos }))
  }

  async componentDidMount () {
    const { id } = getQueryParameter()
    const album = {
      _type: ALBUM_DOCTYPE,
      _id: id
    }

    const photosIds = await cozy.client.data.listReferencedFiles(album)
    const photos = await Promise.all(photosIds.map(cozy.client.files.statById))
    const photosWithUrl = await Promise.all(photos.map(addUrl))
    this.setState(state => ({ ...state, photos: photosWithUrl }))

    const document = await cozy.client.data.find(ALBUM_DOCTYPE, id)
    this.setState(state => ({ ...state, name: document.name }))
  }

  render () {
    return (
      <div>
        <h3>{this.state.name}</h3>
        <PhotoList photos={this.state.photos} />
      </div>
    )
  }
}

function init () {
  const root = document.querySelector('[role=application]')
  const data = root.dataset

  cozy.client.init({
    cozyURL: `//${data.cozyDomain}`,
    token: data.cozyToken
  })

  try {
    cozy.bar.init({
      appName: data.cozyAppName,
      appEditor: data.cozyAppEditor,
      iconPath: data.cozyIconPath,
      lang: data.cozyLocale
    })
  } catch (ex) {
    console.error(ex)
  }

  render(<App />, root)
}
