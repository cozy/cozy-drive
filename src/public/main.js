import React from 'react'
import { render } from 'react-dom'

import App from './App'

document.addEventListener('DOMContentLoaded', init)

function init () {
  const root = document.querySelector('[role=application]')
  const data = root.dataset

  render(<App data={data} />, root)
}
