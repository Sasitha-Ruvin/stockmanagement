"use client";
import React, {useState} from "react";
import { GridColDef } from "@mui/x-data-grid";
import DataGridTable from "@/components/DataGridTable";
import SearchBar from "@/components/SearchBar";
import useOrder from "@/app/hooks/useOrders";
import Swal from "sweetalert2";
import SideBar from "@/components/SideBar";
import ActionButton from "@/components/ui/ActionButton";

const columns: GridColDef[] = [
    {field: "id", headerName:"ID", width:70},
    {field: "issueDate", headerName: "Issued Date", width:250},
    {field: "client", headerName:"Client Name", width:300},
    {field: "clinetContact", headerName:"Client Contact", width:300},
    {
        field:'items',
        headerName: "Items",
        width:700,
        renderCell:(params) =>
            params.row.items.map((item:any) =>
            `${item.name} (Issued:${item.quantity}) (Returned:${item.returnedQuantity})`
            ).join(" / ")
    },
    {field:"returnDate", headerName:"Return Date", width:150},
    {field:"status", headerName: "Status", width:250}

];

const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];


const page = () => {
    const [selectedYear, setSelectedYear] = useState<string | null>(null);
    const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const {
         allOrders,
         filteredOrders, 
         selectedOrderId,
         setSelectedOrderId,
         fetchOrders
    } = useOrder(searchQuery, selectedYear, selectedMonth)

  return (
    <div className="flex h-screen">
        <SideBar/>
        <div className="bg-[#F7F8FA] flex-1 p-8">
        <h2 className="text-2xl font-bold mb-2 text-black">Stock on Rents</h2>
        <div className="flex justify-between items-center mb-4">
            <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
            <div className="flex items-center gap-4">
                <select value={selectedYear || ""} 
                onChange={(e) => setSelectedYear(e.target.value || null)}
                className="border p-2 rounded-md text-black"
                >
                    <option>All Years</option>
                    {Array.from(
                        new Set(
                            allOrders.map((order)=>
                            new Date(order.issueDate).getFullYear()
                        )
                    )
                ).map((year)=>(
                    <option value={year} key={year}>
                        {year}
                    </option>
                ))
                }
                </select>
                <select value={selectedMonth || ""}
                onChange={(e) => setSelectedMonth(e.target.value || null)}
                className="border p-2 rounded-md text-black"
                >
                    <option value="">All Months</option>
                    {months.map((month, index) =>(
                        <option value={String(index +1 )} key={index}>
                            {month}
                        </option>
                    ))}
                </select>
            </div>
        </div>
        <div style={{height:400, width:'100%'}}>
            <DataGridTable
            rows={filteredOrders}
            columns={columns}
            onRowSelectionChange={setSelectedOrderId}
            />
        </div>
        <div className="mt-4 flex flex-grow gap-5">
            <ActionButton color="primary" variant="contained" label="Update" onClick={() =>{
                if(!selectedOrderId){
                    Swal.fire('Error',"Select an Order from the Grid",'error');
                    return;
                }
                window.location.href = `/order/update/${selectedOrderId}`
            }}/>

        </div>
        </div>
    </div>
  )
}

export default page