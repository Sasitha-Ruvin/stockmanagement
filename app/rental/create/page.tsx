'use client';
import SideBar from '@/components/SideBar';
import CustomTextField from '@/components/ui/CustomTextField';
import { Button, TextField } from '@mui/material';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import Swal from 'sweetalert2';

const initialFormData = {
    name: '',
    description: '',
    quantity: '',
  }

const page = () => {
    const router = useRouter();
    const [formData, setFormData] = useState(initialFormData);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
    
        // Validate required fields
        if (!formData.name || !formData.quantity) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Please fill out all required fields.',
          });
          return;
        }
    
        try {
          const formDataObject = new FormData();
          formDataObject.append('name', formData.name);
          formDataObject.append('description', formData.description || '');
          formDataObject.append('quantity', formData.quantity);
    
          const response = await fetch('/api/rentalstock', {
            method: 'POST',
            body: formDataObject,
          });
    
          if (response.ok) {
            Swal.fire({
              title: 'Item Added',
              text: 'Item Added Successfully',
              icon: 'success',
              confirmButtonText: 'OK',
            });
            setFormData(initialFormData);
          } else {
            Swal.fire({
              title: 'Error',
              text: 'Failed to Add Item',
              icon: 'error',
              confirmButtonText: 'Try Again',
            });
          }
        } catch (error) {
          console.error('Error Adding Stock:', error);
          Swal.fire({
            title: 'Error',
            text: 'An unexpected error occurred',
            icon: 'error',
            confirmButtonText: 'Try Again',
          });
        }
      };

  return (
    <div className='flex h-screen'>
        <SideBar />
      <div className="bg-[#F7F8FA] flex-1 p-8">
        <h2 className="text-2xl font-bold mb-4 text-black">Add Rental Item</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <CustomTextField
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              variant="outlined"
            />
            <CustomTextField
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              variant="outlined"
            />
            <TextField
              label="Quantity"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              variant="outlined"
              type="number" 
            />
          </div>
          <div className="mt-4">
            <Button variant="contained" color="primary" className="mt-6" type="submit">
              Add to Stock
            </Button>
          </div>
        </form>
      </div>

    </div>
  )
}

export default page