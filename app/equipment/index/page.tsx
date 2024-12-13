"use client"

import React, {useEffect, useState} from "react"
import { GridColDef } from "@mui/x-data-grid"
import SideBar from "@/components/SideBar"
import DataGridTable from "@/components/DataGridTable"
import SearchBar from "@/components/SearchBar"
import ActionButton from "@/components/ui/ActionButton"
import useEquipment from "@/app/hooks/useEquipment"

const columns:GridColDef[]=[
    {field:'id',headerName:'ID', width:100},
    {field:'name', headerName:'Name', width:250},
    {field:'description', headerName:'Description', width:250},
    {field:'quantity', headerName:"Stock QTY", width:180},
    {field:'unitPrice', headerName:'Unit Price', width:180},
    {field:'supplier', headerName:'Suppliers', width:250}
];


const page = () => {

    const [searchQuery, setSearchQuery] = useState('');

    const{
    allProducts,
    filteredProducts,
    selectedProductId,
    setSelectedProductId,
    handleDelete
    }= useEquipment(searchQuery)


  return (
    <div className="flex h-screen">

        <SideBar/>

        <div className="bg-[#F7F8FA] flex-1 p-8">
            <h2 className="text-2xl font-bold mb-2 text-black">Equipment Stock</h2>

        <div className="flex justify-between items-center mb-4">
          <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery}/>
          <ActionButton label="Add New Item" link='/equipment/create' variant="contained" color="primary"/>
        </div>

        <div style={{height:400, width:'100%'}}>
            <DataGridTable
                rows={filteredProducts}
                columns={columns}
                onRowSelectionChange={setSelectedProductId}
            />
        </div>

        <div className="mt-4">
            <div className="flex gap-4">
                <ActionButton label="Remove Item" onClick={handleDelete} variant="outlined"/>
                <ActionButton  label="New Purchase" color="success" variant="contained"/>

            </div>

        </div>

        </div>

    </div>
  )
}

export default page
