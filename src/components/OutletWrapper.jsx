import React from 'react'
import { Outlet } from 'react-router-dom'

const OutletWrapper = ({ Component }) => (
  <>
    <Component />
    <Outlet />
  </>
)

export default OutletWrapper
