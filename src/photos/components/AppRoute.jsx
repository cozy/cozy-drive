import React from 'react'
import { Route, Redirect } from 'react-router'

import Layout from './Layout'
import Timeline from '../ducks/timeline'
import TimelineClusters from '../ducks/timeline-clusters'
import { AlbumsView, AlbumPhotos, PhotosPicker } from '../ducks/albums'
import PhotosViewer from '../components/PhotosViewer'
import { hot } from 'react-hot-loader'

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
    <Route path="clusters" component={TimelineClusters}>
      <Route path=":photoId" component={PhotosViewer} />
    </Route>
    <Redirect from="/*" to="photos" />
  </Route>
)

const HotedApp = hot(module)(AppRoute)
export default HotedApp
