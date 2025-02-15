import React from 'react'
import AlluserNavbar from '../navbar/AllUserNavbar'
import { Outlet } from 'react-router-dom'
const AllUSer = () => {
  return (
    <div>
      <AlluserNavbar />
      <Outlet/>
    </div>
  )
}

export default AllUSer
