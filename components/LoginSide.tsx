import Image from 'next/image'
import React from 'react'
import logo from '../components/Images/images.jpg'

const LoginSide = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-red-600 text-white p-8">
    <div className="w-32 h-32 bg-gray-300 rounded-md mb-4">
      <Image src={logo} alt="Logo" className="w-32 h-32" />
    </div>
    <h1 className="text-4xl font-bold">Stock Management</h1>
 
</div>
  )
}

export default LoginSide