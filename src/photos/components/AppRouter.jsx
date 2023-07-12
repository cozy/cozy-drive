import React from 'react'
import { createHashRouter, Navigate, RouterProvider } from 'react-router-dom'
import { isFlagshipApp } from 'cozy-device-helper'
import flag from 'cozy-flags'

import { Spinner } from 'cozy-ui/transpiled/react'

import Layout from './Layout'
import Timeline from '../ducks/timeline'
import Backup from '../ducks/backup'
import { AlbumsView, AlbumPhotos, PhotosPicker } from '../ducks/albums'
import { TimelinePhotosViewer, AlbumPhotosViewer } from './PhotosViewer'

function ErrorBoundary() {
  // If there is error uncaugth we redirect to homepage
  return <Navigate to="photos" replace />
}

const DEFAULT_ROUTE =
  flag('flagship.backup.enabled') && isFlagshipApp() ? 'backup' : 'photos'

const router = createHashRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/*',
        element: <Navigate to={DEFAULT_ROUTE} replace />
      },
      {
        path: 'backup',
        element: <Backup />
      },
      {
        path: 'photos',
        element: <Timeline />,
        children: [
          {
            path: ':photoId',
            element: <TimelinePhotosViewer />,
            errorElement: <ErrorBoundary />
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
            errorElement: <ErrorBoundary />,
            children: [
              {
                path: 'edit',
                element: <PhotosPicker />
              },
              {
                path: ':photoId',
                element: <AlbumPhotosViewer />,
                errorElement: <ErrorBoundary />
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
