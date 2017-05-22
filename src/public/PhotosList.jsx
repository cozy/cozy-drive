import React from 'react'

import justifiedLayout from 'justified-layout'

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

const PhotosList = ({photos}) => {
  const layout = justifiedLayout(photos.map(toBox))
  const boxes = layout.boxes.map((box, index) => (
    <img style={getStyle(box)} src={photos[index].url} />
  ))
  return <div style={{position: 'relative'}}>{boxes}</div>
}

export default PhotosList
