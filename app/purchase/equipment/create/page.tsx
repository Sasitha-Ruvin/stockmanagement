'use client'

import { useState, useEffect } from 'react';
import { Button, TextField, MenuItem, IconButton } from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import Swal from 'sweetalert2';
import SideBar from '@/components/SideBar';

interface Material {
  id: number;
  name: string;
}

interface PurchaseItem {
  materialId: number;
  quantity: number;
}

const PurchaseForm = () => {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [purchaseItems, setPurchaseItems] = useState<PurchaseItem[]>([
    { materialId: 0, quantity: 1 },
  ]);
  const [purchaseDate, setPurchaseDate] = useState<string>('');
  const [totalPrice, setTotalPrice] = useState<number>(0); // New state for totalPrice

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const response = await fetch('/api/equipmentstock');
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

  const handleMaterialChange = (index: number, field: keyof PurchaseItem, value: string | number) => {
    const updatedItems = [...purchaseItems];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setPurchaseItems(updatedItems);
  };

  const addPurchaseItem = () => {
    setPurchaseItems([...purchaseItems, { materialId: 0, quantity: 1 }]);
  };

  const removePurchaseItem = (index: number) => {
    const updatedItems = purchaseItems.filter((_, i) => i !== index);
    setPurchaseItems(updatedItems);
  };

  // Handle total price change
  const handleTotalPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTotalPrice(parseFloat(e.target.value));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault(); // Prevent page reload
  
    if (!purchaseDate || purchaseItems.length === 0 || totalPrice <= 0) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Please provide a valid Purchase date, add at least one item, and enter a valid total price",
      });
      return;
    }
  
    try {
      const formData = new FormData();
      formData.append("purchaseDate", purchaseDate);
      formData.append("items", JSON.stringify(purchaseItems));
      formData.append("totalPrice", totalPrice.toString());  // Append totalPrice

      const response = await fetch("/api/purchases/equipment", {
        method: "POST",
        body: formData,
      });
  
      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Purchase Saved",
        });
        setPurchaseDate("");
        setTotalPrice(0); // Reset totalPrice after successful submission
        setPurchaseItems([{ materialId: 0, quantity: 1 }]);
      } else {
        const { error } = await response.json();
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error || "Failed to Save Purchase",
        });
      }
    } catch (error) {
      console.error("Error saving purchase:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An Unexpected Error Occurred... Try Again",
      });
    }
  };
  
  return (
    <div className='flex h-screen'>
        <SideBar/>
        <div className='bg-[#F7F8FA] flex-1 p-8'>
            <h2 className='text-2xl font-bold mb-4 text-black'>Equipment Purchase</h2>
            <form onSubmit={handleSubmit} className="w-full max-w-2xl space-y-6">
                {purchaseItems.map((item, index) => (
                <div key={index} className="grid grid-cols-3 gap-4">
                    <TextField
                    select
                    label="Material"
                    value={item.materialId}
                    onChange={(e) => handleMaterialChange(index, 'materialId', parseInt(e.target.value, 10))}
                    variant="outlined"
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
                    label="Quantity"
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleMaterialChange(index, 'quantity', parseInt(e.target.value, 10))}
                    variant="outlined"
                    />
                    <IconButton color="secondary" onClick={() => removePurchaseItem(index)}>
                    <Delete />
                    </IconButton>
                </div>
                ))}
                <Button variant="outlined" color="primary" startIcon={<Add />} onClick={addPurchaseItem}>
                    Add Material
                </Button>
                <TextField
                label="Purchase Date"
                type="date"
                value={purchaseDate}
                onChange={(e) => setPurchaseDate(e.target.value)}
                variant="outlined"
                fullWidth
                InputLabelProps={{
                    shrink: true,
                }}
                />
                <TextField
                  label="Total Price"
                  type="number"
                  value={totalPrice}
                  onChange={handleTotalPriceChange} // Handle the input change
                  variant="outlined"
                  fullWidth
                />
                <Button variant="contained" color="primary" type="submit">
                    Submit Purchase
                </Button>
            </form>
        </div>

    </div>
  );
};

export default PurchaseForm;
