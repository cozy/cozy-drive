import React from 'react'
import { createHashRouter, RouterProvider } from 'react-router-dom'

import Layout from './Layout'
import Timeline from '../ducks/timeline'
import { AlbumsView, AlbumPhotos, PhotosPicker } from '../ducks/albums'
import { TimelinePhotosViewer, AlbumPhotosViewer } from './PhotosViewer'
import { Spinner } from 'cozy-ui/transpiled/react'
import OutletWrapper from 'components/OutletWrapper'

const router = createHashRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: 'photos',
        element: <OutletWrapper component={Timeline} />,
        children: [
          {
            path: ':photoId',
            element: <TimelinePhotosViewer />
          }
        ]
      },
      {
        path: 'albums',
        children: [
          {
            path: '',
            element: <AlbumsView />
          },
          {
            path: 'new',
            element: <PhotosPicker />
          },
          {
            path: ':albumId',
            element: <OutletWrapper component={AlbumPhotos} />,
            children: [
              {
                path: 'edit',
                element: <PhotosPicker />
              },
              {
                path: ':photoId',
                element: <AlbumPhotosViewer />
              }
            ]
          }
        ]
      }
    ]
  }
])

const AppRouter = () => (
  <RouterProvider router={router} fallbackElement={<Spinner />} />
)

export default AppRouter
