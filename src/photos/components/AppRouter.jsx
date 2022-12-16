import React from 'react'
import { createHashRouter, RouterProvider } from 'react-router-dom'

import Layout from './Layout'
import Timeline from '../ducks/timeline'
import { AlbumsView, AlbumPhotos, PhotosPicker } from '../ducks/albums'
import PhotosViewer from './PhotosViewer'
import { Spinner } from 'cozy-ui/transpiled/react'

const router = createHashRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: 'photos',
        element: <Timeline />,
        children: [
          {
            path: ':photoId',
            element: <PhotosViewer />
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
            element: <AlbumPhotos />,
            children: [
              {
                path: 'edit',
                element: <PhotosPicker />
              },
              {
                path: ':photoId',
                element: <PhotosViewer />
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
