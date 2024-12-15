"use client"
import React, { useState } from "react";
import { GridColDef } from "@mui/x-data-grid";
import SideBar from "@/components/SideBar";
import DataGridTable from "@/components/DataGridTable";
import SearchBar from "@/components/SearchBar";
import ActionButton from "@/components/ui/ActionButton";
import BeatLoader from "react-spinners/BeatLoader";
import usePurchases from "@/app/hooks/useMaterialPurchase";

const columns:GridColDef[] = [
    {field: 'id', headerName:"ID", width:70},
    {field: 'purchaseDate', headerName:'Purchased Date', width:100},
    {field: 'totalItems', headerName: 'Total Items', width:70},
    {
        field: "items",
        headerName: "Items",
        width: 300,
        renderCell: (params) => 
          params.row.items
            .map((item: any) => `${item.name} (Qty: ${item.quantity})`)
            .join(", "),
      },
 
];

const page = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const{
        allPurchases,
        filteredPurchases,
        selectedPurchaseId,
        setSelectedPurchaseId,
        fetchPurchases,
    }=usePurchases(searchQuery)

    
  return (
    <div className="flex h-screen">
        <SideBar/>
        <div  className='bg-[#F7F8FA] flex-1 p-8'>
        <h2 className='text-2xl font-bold mb-2 text-black'>Material Purchases</h2>

        <div className="flex justify-between items-center mb-4">
            <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
            <ActionButton label="New Purchase" link="/purchase/material/create" />

        </div>

        <div style={{height:400, width:'100%'}}>
            <DataGridTable
            rows={filteredPurchases}
            columns={columns}
            onRowSelectionChange={setSelectedPurchaseId}   
            />
        </div>
        </div>
    </div>
  )
}

export default page