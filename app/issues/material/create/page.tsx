'use client';

import { useState, useEffect } from 'react';
import { Button, TextField, MenuItem, IconButton } from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import Swal from 'sweetalert2';
import SideBar from '@/components/SideBar';

interface Material {
  id: number;
  name: string;
}

interface IssueItem {
  materialId: number;
  quantity: number;
}

const MaterialIssueForm = () => {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [issueItems, setIssueItems] = useState<IssueItem[]>([{ materialId: 0, quantity: 1 }]);
  const [issueDate, setIssueDate] = useState<string>('');
  const [issueReason, setIssueReason] = useState<string>('');
  const [issuedBy, setIssuedBy] = useState<string>('');
  const [issuedTo, setIssuedTo] = useState<string>('');

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const response = await fetch('/api/materialstock');
        if (response.ok) {
          const data: Material[] = await response.json();
          setMaterials(data);
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to fetch materials.',
          });
        }
      } catch (error) {
        console.error('Error fetching materials:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'An unexpected error occurred while fetching materials.',
        });
      }
    };

    fetchMaterials();
  }, []);

  const handleMaterialChange = (index: number, field: keyof IssueItem, value: string | number) => {
    const updatedItems = [...issueItems];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setIssueItems(updatedItems);
  };

  const addIssueItem = () => {
    setIssueItems([...issueItems, { materialId: 0, quantity: 1 }]);
  };

  const removeIssueItem = (index: number) => {
    const updatedItems = issueItems.filter((_, i) => i !== index);
    setIssueItems(updatedItems);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!issueDate || issueItems.length === 0) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please provide a valid Issue Date and add at least one item.',
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append('issueDate', issueDate);
      formData.append('issueReason', issueReason);
      formData.append('issuedBy', issuedBy);
      formData.append('issuedTo', issuedTo);
      formData.append('items', JSON.stringify(issueItems));

      const response = await fetch('/api/issues/material', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Items Issued Successfully.',
        });
        setIssueDate('');
        setIssueReason('');
        setIssuedBy('');
        setIssuedTo('');
        setIssueItems([{ materialId: 0, quantity: 1 }]);
      } else {
        const { error } = await response.json();
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error || 'Failed to Complete Material Issue.',
        });
      }
    } catch (error) {
      console.error('Error issuing material:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'An unexpected error occurred. Please try again.',
      });
    }
  };

  return (
    <div className='flex h-screen'>
      <SideBar />
      <div className='bg-[#F7F8FA] flex-1 p-8'>
        <h2 className='text-2xl font-bold mb-4 text-black'>Issue Materials</h2>
        <form onSubmit={handleSubmit} className='w-full max-w-2xl space-y-6'>
          {issueItems.map((item, index) => (
            <div key={index} className='grid grid-cols-3 gap-4'>
              <TextField
                select
                label='Material'
                value={item.materialId}
                onChange={(e) => handleMaterialChange(index, 'materialId', parseInt(e.target.value, 10))}
                variant='outlined'
              >
                <MenuItem value={0} disabled>
                  Select Material
                </MenuItem>
                {materials.map((material) => (
                  <MenuItem key={material.id} value={material.id}>
                    {material.name}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label='Quantity'
                type='number'
                value={item.quantity}
                onChange={(e) => handleMaterialChange(index, 'quantity', parseInt(e.target.value, 10))}
                variant='outlined'
              />
              <IconButton color='secondary' onClick={() => removeIssueItem(index)}>
                <Delete />
              </IconButton>
            </div>
          ))}
          <Button variant='outlined' color='primary' startIcon={<Add />} onClick={addIssueItem}>
            Add Material
          </Button>
          <TextField
            label='Issue Date'
            type='date'
            value={issueDate}
            onChange={(e) => setIssueDate(e.target.value)}
            variant='outlined'
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            label='Issue Reason'
            value={issueReason}
            onChange={(e) => setIssueReason(e.target.value)}
            variant='outlined'
            fullWidth
          />
          <TextField
            label='Issued By'
            value={issuedBy}
            onChange={(e) => setIssuedBy(e.target.value)}
            variant='outlined'
            fullWidth
          />
          <TextField
            label='Issued To'
            value={issuedTo}
            onChange={(e) => setIssuedTo(e.target.value)}
            variant='outlined'
            fullWidth
          />
          <Button variant='contained' color='primary' type='submit'>
            Issue Materials
          </Button>
        </form>
      </div>
    </div>
  );
};

export default MaterialIssueForm;
