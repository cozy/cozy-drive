import React from 'react'
import { Route, Redirect } from 'react-router'

import Timeline from '../containers/Timeline'
import AlbumsView from '../containers/AlbumsView'
import AlbumPhotos from '../containers/AlbumPhotos'
import Viewer from '../containers/Viewer'

import App from './App'
export const ComingSoon = () => (<p style='margin-left: 2em'>Coming soon!</p>)

const AppRoute = (
  <Route component={App}>
    <Redirect from='/' to='photos' />
    <Route path='photos' component={Timeline}>
      <Route path=':photoId' component={Viewer} />
    </Route>
    <Route path='albums' component={AlbumsView}>
      <Route path=':albumId' component={AlbumPhotos}>
        <Route path=':photoId' component={Viewer} />
      </Route>
    </Route>
  </Route>
)

export default AppRoute
