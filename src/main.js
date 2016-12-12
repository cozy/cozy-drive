require('./styles')

import {render, h} from 'preact'

document.addEventListener('DOMContentLoaded', () => {
  render((
    <h1>Hello World!</h1>
  ), document.querySelector('[role=application]'))
})
