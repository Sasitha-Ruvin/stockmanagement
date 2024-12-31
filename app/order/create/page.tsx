"use client"
import React, {useState, useEffect} from 'react'
import { Button, TextField, MenuItem, IconButton } from '@mui/material'
import { Add, Delete } from '@mui/icons-material'
import Swal from 'sweetalert2'
import SideBar from '@/components/SideBar'
import { useRouter } from 'next/navigation'

interface Rental{
    id:number;
    name:string;
}

interface OrderItem{
    rentalstockid:number;
    quantity:number;
}


const OrderPage = () => {
    const [rental, setRental] = useState<Rental[]>([]);
    const router = useRouter();
    const [orderItems, setOrderItems] = useState<OrderItem[]>([{rentalstockid:0, quantity:1}]);
    const [issueDate, setIssueDate] = useState<string>('');
    const [returnDate, setReturnDate] = useState<string>('');
    const [client, setClient] = useState<string>('');
    const [clinetContact, setClinetContact] = useState<string>('');

    useEffect(() => {
        const fetchRentals = async () => {
            try {
                const response = await fetch('/api/rentalstock');
                if(response.ok){
                    const data: Rental[] = await response.json();
                    setRental(data);
                }else{
                    Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Failed to fetch equipment.',
                    });
                }
            } catch (error) {
                console.log("error fetching equipments: ", error);
                Swal.fire({
                    icon:'error',
                    title: 'Error',
                    text:"An Unexpected Errro Occured"
                });
            }
        };

        fetchRentals();
    }, []);

    const handleRentalChange = (index:number, field: keyof OrderItem, value: string | number) =>{
        const updatedItems = [...orderItems];
        updatedItems[index] = { ...updatedItems[index], [field]:value};
        setOrderItems(updatedItems);
    };

    const addItem = () => {
        setOrderItems([...orderItems, {rentalstockid:0, quantity:1}]);
    };

    const removeItem = (index:number) => {
        const updatedItems = orderItems.filter((_,i)=> i !== index);
        setOrderItems(updatedItems);
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if(!issueDate || orderItems.length === 0 || !client || !clinetContact || !returnDate){
            Swal.fire({
                icon:'error',
                title:'Error',
                text:"Please fill in all the fields"
            });
            return;
        }

        try {
            const formData = new FormData();
            formData.append('issueDate', issueDate);
            formData.append('returnDate', returnDate);
            formData.append('client', client);
            formData.append('clinetContact', clinetContact);
            formData.append('items', JSON.stringify(orderItems));

            const response = await fetch('/api/order',{
                method:'POST',
                body:formData
            });

            if(response.ok){
                Swal.fire({
                    icon:'success',
                    title:'Success',
                    text:"Order Created",
                });

                router.push('/order/index');
            }else{
                const {error} = await response.json();
                Swal.fire({
                    icon:'error',
                    title:"Error",
                    text: error || "Failed to Create Order",
                });
            }
        } catch (error) {
            console.log('Error Creating Order', error);
            Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'An unexpected error occurred. Please try again.',
            });
        }
    };
  return (
    <div className='flex h-screen'>
        <SideBar/>
        <div className="bg-[#F7F8FA] flex-1 p-8">
            <h2 className="text-2xl font-bold mb-4 text-black">Rent Equipment</h2>
            <form onSubmit={handleSubmit} className='w-full max-w-2xl space-y-6'>
                {orderItems.map((item, index)=>(
                    <div key={index} className='grid grid-cols-3 gap-4'>
                        <TextField
                        select
                        label="Equipment"
                        value={item.rentalstockid}
                        onChange={(e) =>
                            handleRentalChange(index, 'rentalstockid', parseInt(e.target.value, 10))
                        }
                        variant='outlined'
                        >
                            <MenuItem value={0} disabled>
                                Select Equipment
                            </MenuItem>
                            {rental.map((equipment)=> (
                                <MenuItem key={equipment.id} value={equipment.id}>
                                    {equipment.name}
                                </MenuItem>
                            ))}
                        </TextField>
                        <TextField
                        label="Quantity"
                        type='number'
                        value={item.quantity}
                        onChange={(e) => 
                            handleRentalChange(index, 'quantity', parseInt(e.target.value, 10))
                        }
                        variant='outlined'
                        />
                        <IconButton color='secondary' onClick={() => removeItem(index)}>
                            <Delete/>
                        </IconButton>
                    </div>
                ))}
                <Button color='primary' variant='outlined' startIcon={<Add/>} onClick={addItem}>
                    <Add/>
                </Button>
                <TextField
                label= "Issue Date"
                type='date'
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                variant='outlined'
                fullWidth
                InputLabelProps={{
                    shrink:true
                }}
                />
                <TextField
                label="Client Name"
                value={client}
                onChange={(e) => setClient(e.target.value)}
                variant='outlined'
                fullWidth
                />
                <TextField
                label="Client Contact"
                value={clinetContact}
                onChange={(e)=> setClinetContact(e.target.value)}
                variant='outlined'
                fullWidth
                />
                <TextField
                label="Return Date"
                type='date'
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                variant='outlined'
                fullWidth
                InputLabelProps={{
                    shrink:true
                }}
                />
                <Button variant='contained' color='primary' type='submit'>
                    Rent Item/s
                </Button>
            </form>
        </div>
    </div>
  )
}

export default OrderPage