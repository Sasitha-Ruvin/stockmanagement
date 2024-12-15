"use client"

import React, { useEffect, useState } from 'react'
import ActionButton from './ui/ActionButton'
import SideBarLinkButton from './ui/SideBarLinkButton'
import Cookies from 'js-cookie'
import {jwtDecode} from 'jwt-decode';

const SideBar = () => {
    const [userName, setUserName] = useState<string | null>(null);

    useEffect(()=>{
        const token = Cookies.get('authToken');
        if(token){
            const decodedToken:{name:string} = jwtDecode(token)
            setUserName(decodedToken.name);

            
        }
    })

  return (
    <div className="bg-[#20252C] text-white w-1/4 p-6 flex flex-col justify-between">
      <div>
        <div className="flex items-center mb-6">
          <div className="mr-4"></div>
          <div>
            <h3 className="text-xl font-bold">{userName || 'User'}</h3>
          </div>
        </div>

        {/* Navigation */}
        <ul>
          <li className='mb-4'>
            <SideBarLinkButton href='/dashboard' label="Dashboard"/>
          </li>
          <li className="mb-4">
              <SideBarLinkButton href="/materialstocks/index" label="Material Stock Management" />
          </li>
          <li className="mb-4">
              <SideBarLinkButton href="/equipment/index" label="Equipment Stock Management" />
          </li>
          <li className="mb-4">
              <SideBarLinkButton href="/rents/index" label="Rental Stock Management" />
          </li>
          <li className="mb-4">
              <SideBarLinkButton href="/issues/index" label="Stock Issues" />
          </li>
          <li className="mb-4">
              <SideBarLinkButton href="/issues/index" label="Equipment Issues" />
          </li>
          <li className="mb-4">
              <SideBarLinkButton href="/issues/index" label="On Going Rentals" />
          </li>
          <li className='mb-4'>
            <SideBarLinkButton href='/purchase/material/index' label='Material Purchases' />
          </li>
          {/* <li className="mb-4">
              <SideBarLinkButton href="/orders/index" label="Orders Management" />
          </li>
          <li className="mb-4">
              <SideBarLinkButton href="/suppliers/index" label="Supplier Management" />
          </li>
          <li className="mb-4">
              <SideBarLinkButton href="/customers/index" label="Client Management" />
          </li>
          <li className="mb-4">
              <SideBarLinkButton href="/resourcehub/index" label="Resource Hub" />
          </li> */}
        </ul>
      </div>

      {/* Log Out Button */}
      <div className="mt-4">
        <ActionButton isLogout={true} />
      </div>
    </div>
  )
}

export default SideBar