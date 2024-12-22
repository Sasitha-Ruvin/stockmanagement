'use client';

import { useState, useEffect } from 'react';
import { Button, TextField, MenuItem, IconButton } from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import Swal from 'sweetalert2';
import SideBar from '@/components/SideBar';

interface Equipment {
  id: number;
  name: string;
}

interface IssueItem {
  equipmentId: number;
  quantity: number;
}

const EquipmentIssueForm = () => {
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [issueItems, setIssueItems] = useState<IssueItem[]>([{ equipmentId: 0, quantity: 1 }]);
  const [issueDate, setIssueDate] = useState<string>('');
  const [issueReason, setIssueReason] = useState<string>('');
  const [issuedBy, setIssuedBy] = useState<string>('');
  const [issuedTo, setIssuedTo] = useState<string>('');

  useEffect(() => {
    const fetchEquipments = async () => {
      try {
        const response = await fetch('/api/equipmentstock');
        if (response.ok) {
          const data: Equipment[] = await response.json();
          setEquipments(data);
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to fetch equipment.',
          });
        }
      } catch (error) {
        console.error('Error fetching equipment:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'An unexpected error occurred while fetching equipment.',
        });
      }
    };

    fetchEquipments();
  }, []);

  const handleEquipmentChange = (index: number, field: keyof IssueItem, value: string | number) => {
    const updatedItems = [...issueItems];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setIssueItems(updatedItems);
  };

  const addIssueItem = () => {
    setIssueItems([...issueItems, { equipmentId: 0, quantity: 1 }]);
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

      const response = await fetch('/api/issues/equipment', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Equipment Issued Successfully.',
        });
        setIssueDate('');
        setIssueReason('');
        setIssuedBy('');
        setIssuedTo('');
        setIssueItems([{ equipmentId: 0, quantity: 1 }]);
      } else {
        const { error } = await response.json();
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error || 'Failed to Complete Equipment Issue.',
        });
      }
    } catch (error) {
      console.error('Error issuing equipment:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'An unexpected error occurred. Please try again.',
      });
    }
  };

  return (
    <div className="flex h-screen">
      <SideBar />
      <div className="bg-[#F7F8FA] flex-1 p-8">
        <h2 className="text-2xl font-bold mb-4 text-black">Issue Equipment</h2>
        <form onSubmit={handleSubmit} className="w-full max-w-2xl space-y-6">
          {issueItems.map((item, index) => (
            <div key={index} className="grid grid-cols-3 gap-4">
              <TextField
                select
                label="Equipment"
                value={item.equipmentId}
                onChange={(e) =>
                  handleEquipmentChange(index, 'equipmentId', parseInt(e.target.value, 10))
                }
                variant="outlined"
              >
                <MenuItem value={0} disabled>
                  Select Equipment
                </MenuItem>
                {equipments.map((equipment) => (
                  <MenuItem key={equipment.id} value={equipment.id}>
                    {equipment.name}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label="Quantity"
                type="number"
                value={item.quantity}
                onChange={(e) =>
                  handleEquipmentChange(index, 'quantity', parseInt(e.target.value, 10))
                }
                variant="outlined"
              />
              <IconButton color="secondary" onClick={() => removeIssueItem(index)}>
                <Delete />
              </IconButton>
            </div>
          ))}
          <Button variant="outlined" color="primary" startIcon={<Add />} onClick={addIssueItem}>
            Add Equipment
          </Button>
          <TextField
            label="Issue Date"
            type="date"
            value={issueDate}
            onChange={(e) => setIssueDate(e.target.value)}
            variant="outlined"
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            label="Issue Reason"
            value={issueReason}
            onChange={(e) => setIssueReason(e.target.value)}
            variant="outlined"
            fullWidth
          />
          <TextField
            label="Issued By"
            value={issuedBy}
            onChange={(e) => setIssuedBy(e.target.value)}
            variant="outlined"
            fullWidth
          />
          <TextField
            label="Issued To"
            value={issuedTo}
            onChange={(e) => setIssuedTo(e.target.value)}
            variant="outlined"
            fullWidth
          />
          <Button variant="contained" color="primary" type="submit">
            Issue Equipment
          </Button>
        </form>
      </div>
    </div>
  );
};

export default EquipmentIssueForm;
