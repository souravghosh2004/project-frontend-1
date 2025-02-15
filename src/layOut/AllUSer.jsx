import React from 'react'
import AlluserNavbar from '../navbar/AllUserNavbar'
import { Outlet } from 'react-router-dom'
const AllUser = () => {
  return (
    <div>
      <AlluserNavbar />
      <Outlet/>
    </div>
  )
}

export default AllUser
