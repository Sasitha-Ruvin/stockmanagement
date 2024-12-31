"use client"

import React, { useState, useEffect } from "react";
import { TextField, Button } from "@mui/material";
import { useRouter, useParams } from "next/navigation";
import Swal from "sweetalert2";
import SideBar from "@/components/SideBar";

interface RentalIssueItem{
    id:number;
    name:string;
    quantity:number;
    returnedQuantity:number;
}

interface FormData{
    status: string;
    returnedItems: RentalIssueItem[];
}

const OrderUpdateForm = () => {
    const router = useRouter();
    const { id } = useParams();

    const [formData, setFormData] = useState<FormData>({
        status:"On Rent",
        returnedItems:[],
    });

    const fetchOrderDetails = async () => {
        try {
            const response = await fetch(`/api/order/${id}`);
            if (!response.ok) {
                throw new Error("Failed to Fetch Order Details");
            }
            const data = await response.json();
            console.log("Fetched Data:", data); 
    
            setFormData({
                status: data.status || "On Rent",
                returnedItems: data.rentitems
                    ? data.rentitems.map((item: any) => ({
                          id: item.id,
                          name: item.rentalstock.name,
                          returnedQuantity: item.returnedQuantity || 0,
                          quantity: item.quantity,
                      }))
                    : [],
            });
        } catch (error) {
            console.log("Error fetching issue details:", error);
            Swal.fire("Error", "Failed to fetch issue details", "error");
        }
    };
    

    useEffect(() => {
        if(id){
            fetchOrderDetails();
        }
    }, [id]);

    const handleChange = (e:React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, itemId?:number)=>{
        const {name, value} = e.target;

        if(name === 'status'){
            setFormData((prev)=> ({...prev, status:value}));
        }else if(name === 'returnedQuantity' && itemId !== undefined){
            setFormData((prev) => ({
                ...prev,
                returnedItems:prev.returnedItems.map((item) =>
                item.id === itemId ? {...item, returnedQuantity: parseInt(value)} : item
            ),
        }));
        }
    };

    const handleUpdate = async (e:React.FormEvent) =>{
        e.preventDefault();

        const updateData = {
            status: formData.status,
            returnedItems: formData.returnedItems.map(item => ({
                id:item.id,
                returnedQuantity: item.returnedQuantity
            })),
        };

        try {
            const response = await fetch(`/api/order/${id}`,{
                method: "PUT",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(updateData),
            });

            if(!response.ok) throw new Error("Failed to Update Order");

            Swal.fire("Success", "Order Updated Successfully", "success");
            router.push("/order/index");
        } catch (error) {
            console.log("Error Updating Order: ", error);
            Swal.fire("Error", "Failed to Update Order", 'error')
        }
    };
  return (
    <div className="flex h-screen">
        <SideBar/>
        <div className="bg-[#F7F8FA] flex-1 p-8">
        <h2 className="text-2xl font-bold mb-4 text-black">Update Order</h2>
        <form onSubmit={handleUpdate} className="space-y-6">
            <div className="space-y-4">
                <h3 className="font-semibold">Rented Items</h3>
                {formData.returnedItems.map((item) =>(
                    <div key={item.id} className="bg-gray-100 rounded-md">
                        <p>
                            <strong>{item.name}(Qty: {item.quantity}) - Returned: {item.returnedQuantity}</strong>
                        </p>
                        <TextField 
                        label="Returned Quantity"
                        type="number"
                        value={item.returnedQuantity}
                        onChange={(e) => handleChange(e, item.id)}
                        name="returnedQuantity"
                        variant="outlined"
                        fullWidth
                        />
                    </div>
                ))}
            </div>
            <TextField
                label="Status"
                name="status"
                value={formData.status}
                onChange={(e) => handleChange(e)}
                fullWidth
                variant="outlined"
            />

            <Button type="submit" variant="contained" color="primary" className="mt-6">
                Update Order
            </Button>
        </form>
        </div>

    </div>
  )
}

export default OrderUpdateForm