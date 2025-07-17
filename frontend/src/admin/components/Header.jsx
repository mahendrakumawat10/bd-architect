import React from 'react'
import { IoSettingsOutline } from "react-icons/io5";
import { useSelector } from 'react-redux';

export default function Header() {
  const admin = useSelector((state) => state.admin.data);

  return (
    <div className='w-full px-4 md:px-6 py-4 bg-white shadow-md flex flex-col md:flex-row items-center justify-between gap-4'>
      <div className='text-center md:text-left'>
        <div className='flex items-center gap-2'>
          <h1 className='text-xl md:text-2xl font-bold'>Welcome {admin?.name}</h1>
          <img className='w-6 h-6' src="https://media.tenor.com/Yj4grvIBitkAAAAM/jake-is.gif" alt="wave" />
        </div>
        <p className='text-gray-700 text-sm'>Here's what's happening with your store today.</p>
      </div>

      <div className='flex items-center gap-3'>
        <img className='w-12 h-12 rounded-full' src="https://cdn-icons-png.flaticon.com/512/5575/5575019.png" alt="admin" />
        <div className='text-[#5b6e94]'>
          <h3 className='font-bold'>{admin?.name}</h3>
          <div className='text-sm'>Admin</div>
        </div>
        <IoSettingsOutline className='text-xl animate-spin' />
      </div>
    </div>
  )
}
