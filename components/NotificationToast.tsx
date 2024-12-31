import React from 'react'

type NotificationToastProps = {
    message:string;
    onClose: () => void
}

export const NotificationToast = ({message, onClose}:NotificationToastProps) => {
  return (
    <div className='fixed bottom-5 right-5 bg-blue-500 text-white p-4 rounded shadow-lg z-50'>
        <div className='flex justify-between items-center'>
            <span>{message}</span>
            <button onClick={onClose} className='ml-4 text-lg font-bold'>
                &times;
            </button>
        </div>

    </div>
  )
}
