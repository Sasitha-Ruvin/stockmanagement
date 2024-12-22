'use client';

import { useState, useEffect } from 'react';
import { Button, TextField, MenuItem, IconButton } from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import Swal from 'sweetalert2';
import SideBar from '@/components/SideBar';

interface Rental {
    id:number;
    name:string;
}

interface PurchaseItem {
    rentalstockid: number;
    quantity: number;
    unitPrice: number;
    unitTotal: number;
}
const page = () => {

    const [rentals, setRentals] = useState<Rental[]>([]);
    const [purchaseItems, setPurchaseItems] = useState<PurchaseItem[]>([
        { rentalstockid: 0, quantity: 1,unitPrice:0,unitTotal:0 },
    ]);
    const [purchaseDate, setPurchaseDate] = useState<string>('');
    const [supplier, setSupplier] = useState<string>('');
    const [total, setTotal] = useState<number>(0);
    const [reason, setReason] = useState<string>('');

    useEffect(()=>{
        const fetchRentals = async () =>{
            try {
                const response = await fetch('/api/rentalstock');
                if(response.ok){
                    const data:Rental[]= await response.json();
                    setRentals(data);
                }else{
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
        fetchRentals();
    },[]);

    const calculateTotal = (items:PurchaseItem[])=>{
        const total = items.reduce((sum, item)=> sum + item.unitTotal, 0);
        setTotal(total) 
    }
    
  const handleMaterialChange = (index: number, field: keyof PurchaseItem, value: string | number) => {
    const updatedItems = [...purchaseItems];
    updatedItems[index] ={
      ...updatedItems[index],
      [field]:field === 'quantity' || field === 'unitPrice' ? parseFloat(value as string) : value,
    }
    updatedItems[index].unitTotal = updatedItems[index].quantity * updatedItems[index].unitPrice;
    setPurchaseItems(updatedItems);
    calculateTotal(updatedItems);
  };

  const addPurchaseItem = () => {
    setPurchaseItems([...purchaseItems, { rentalstockid: 0, quantity: 1, unitPrice:0, unitTotal:0 }]);
  };
  const removePurchaseItem = (index: number) => {
    const updatedItems = purchaseItems.filter((_, i) => i !== index);
    setPurchaseItems(updatedItems);
    calculateTotal(updatedItems)
  };

  const handleSubmit = async (event: React.FormEvent) =>{
    event.preventDefault();

      if (!purchaseDate || purchaseItems.length === 0) {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Please provide a valid Purchase date and add at least one item",
          });
          return;
    }

    try {
        const formData = new FormData();
        formData.append('purchaseDate', purchaseDate);
        formData.append("items", JSON.stringify(purchaseItems));
        formData.append('supplier',supplier.toString());
        formData.append('reason', reason.toString());

        const response = await fetch("/api/purchases/rental",{
            method:"POST",
            body:formData,
        });

        if(response.ok){
            Swal.fire({
            icon: "success",
            title: "Success",
            text: "Purchase Saved",
            });
            setPurchaseDate("");
            setPurchaseItems([{ rentalstockid: 0, quantity: 1, unitPrice:0, unitTotal:0 }]);
        }else{
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
        })     
    }
  };
    
  return (
    <div className='flex h-screen'>
        <SideBar/>
        <div className='bg-[#F7F8FA] flex-1 p-8'>
            <h2 className='text-2xl font-bold mb-4 text-black'>New Material Purchase</h2>
            <form onSubmit={handleSubmit} className="w-full max-w-2xl space-y-6">
                {purchaseItems.map((item, index) => (
                <div key={index} className="grid grid-cols-3 gap-4">
                    <TextField
                    select
                    label="Material"
                    value={item.rentalstockid}
                    onChange={(e) => handleMaterialChange(index, 'rentalstockid', parseInt(e.target.value, 10))}
                    variant="outlined"
                    >
                    <MenuItem value={0} disabled>
                        Select Material
                    </MenuItem>
                    {rentals.map((rental) => (
                        <MenuItem key={rental.id} value={rental.id}>
                        {rental.name}
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
                    <TextField 
                     label="Unit Price"
                     type='number'
                     value={item.unitPrice}
                     onChange={(e)=> handleMaterialChange(index, 'unitPrice', parseFloat(e.target.value))}
                     variant='outlined'
                    />
                    <TextField
                    label = "Unit Total"
                    value={item.unitTotal.toFixed(2)}
                    variant='outlined'
                    InputProps={{
                      readOnly:true,
                    }}
                    
                    />
                    <IconButton color="secondary" onClick={() => removePurchaseItem(index)}>
                    <Delete />
                    </IconButton>
                </div>
                ))}
                <Button variant="outlined" color="primary" startIcon={<Add />} onClick={addPurchaseItem}>
                    Add More 
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
                label="Supplier"
                value={supplier}
                onChange={(e)=> setSupplier(e.target.value)}
                variant='outlined'  
                fullWidth
                />
                <TextField
                label="Purchase Reason"
                value={reason}
                onChange={(e)=>setReason(e.target.value)}
                variant='outlined'
                multiline
                rows={3}
                fullWidth
                />
                <TextField
                label='Total'
                value={total.toFixed(2)}
                variant='outlined'
                fullWidth
                InputProps={{
                  readOnly:true
                }}
                
                />
                <Button variant="contained" color="primary" type="submit">
                    Submit Purchase
                </Button>
            </form>
        </div>

    </div>
  )
}

export default page