"use client"
import React, { useState } from "react";
import { GridColDef } from "@mui/x-data-grid";
import SideBar from "@/components/SideBar";
import DataGridTable from "@/components/DataGridTable";
import SearchBar from "@/components/SearchBar";
import ActionButton from "@/components/ui/ActionButton";
import BeatLoader from "react-spinners/BeatLoader";
import useRental from "@/app/hooks/useRental";


const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "name", headerName: "Name", width: 250 },
    { field: "description", headerName: "Description", width: 250 },
    { field: "quantity", headerName: "In Stock QTY", width: 150 },
  ];
const page = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const {allProducts,
        filteredProducts,
        selectedProductId,
        setSelectedProductId,
        loading} = useRental(searchQuery)

  return (
    <div className="flex h-screen">
        <SideBar/>
        <div className="bg-[#F7F8FA] flex-1 p-8">
        <h2 className="text-2xl font-bold mb-2 text-black">Rental Stocks</h2>

        <div className="flex justify-between items-center mb-4">
          <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          <ActionButton label="Add New Item" link="/rental/create" variant="contained" color="primary" />
        </div>

        {/* Show loading spinner if loading is true */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <BeatLoader color="#000000" />
          </div>
        ) : (
          <div style={{ height: 400, width: "100%" }}>
            <DataGridTable rows={filteredProducts} columns={columns} onRowSelectionChange={setSelectedProductId} />
          </div>
        )}

        <div className="mt-4">
          <div className="flex gap-4">
            {/* <ActionButton label="Remove Item"  variant="outlined" color="error" /> */}
            <ActionButton label="New Purchase" color="success" variant="contained" link="/purchase/rental/create" />
            <ActionButton label="Rent Items" color="primary" variant="contained" link="/orders/create" />
          </div>
        </div>
      </div>

    </div>
  )
}

export default page