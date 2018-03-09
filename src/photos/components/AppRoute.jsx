import React from 'react'
import { Route, Redirect } from 'react-router'

import Layout from './Layout'
import Timeline from '../ducks/timeline'
import { AlbumsView, AlbumPhotos, PhotosPicker } from '../ducks/albums'
import PhotosViewer from '../components/PhotosViewer'

export const ComingSoon = () => <p style="margin-left: 2em">Coming soon!</p>

const AppRoute = (
  <Route component={Layout}>
    <Route path="photos" component={Timeline}>
      <Route path=":photoId" component={PhotosViewer} />
    </Route>
    <Route path="albums" component={AlbumsView}>
      <Route path="new" component={PhotosPicker} />
      <Route path=":albumId" component={AlbumPhotos}>
        <Route path="edit" component={PhotosPicker} />
        <Route path=":photoId" component={PhotosViewer} />
      </Route>
    </Route>
    <Redirect from="/*" to="photos" />
  </Route>
)

export default AppRoute
