"use client"

import React, {useEffect, useState} from "react"
import { GridColDef } from "@mui/x-data-grid"
import SideBar from "@/components/SideBar"
import DataGridTable from "@/components/DataGridTable"
import SearchBar from "@/components/SearchBar"
import ActionButton from "@/components/ui/ActionButton"
import Swal from "sweetalert2"
import useMaterialStock from "@/app/hooks/useMaterialStock"


const columns:GridColDef[]=[
  {field:'id',headerName:'ID',width:70},
  {field:'name', headerName: 'Name', width:250},
  {field:'description', headerName: 'Description', width:250},
  {field:"quantity", headerName: 'In Stock QTY', width:150},
  {field:"supplier", headerName:'Supplier', width:150}

];

const page = () => {

  const [searchQuery, setSearchQuery]= useState('');

  const{
    allProducts,
    filteredProducts,
    selectedProductId,
    setSelectedProductId,
    handleDelete
  } = useMaterialStock(searchQuery)
  return (
    <div className="flex h-screen">

      <SideBar/>
      <div className="bg-[#F7F8FA] flex-1 p-8">
        <h2 className="text-2xl font-bold mb-2 text-black">Material Stocks</h2>

        <div className="flex justify-between items-center mb-4">
          <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery}/>
          <ActionButton label="Add New Item" link='/materialstocks/create' variant="contained" color="primary"/>
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
            <ActionButton label="Remove Item" onClick={handleDelete} variant="outlined" color="error"/>
            <ActionButton label="New Purchase" color="success" variant="contained" link="/purchase/material/index"/>
          </div>
        </div>
      </div>
    </div>
  )
}

export default page