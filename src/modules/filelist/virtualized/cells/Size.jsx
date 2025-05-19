import React from 'react'

const _Size = ({ filesize }) => <>{filesize}</>

const Size = React.memo(_Size)

export default Size
