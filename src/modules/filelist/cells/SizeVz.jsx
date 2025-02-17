import React from 'react'

const _SizeVz = ({ filesize }) => <>{filesize}</>

const SizeVz = React.memo(_SizeVz)

export default SizeVz
