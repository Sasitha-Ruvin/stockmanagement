"use client";

import React, { useState } from "react";
import { GridColDef } from "@mui/x-data-grid";
import SideBar from "@/components/SideBar";
import DataGridTable from "@/components/DataGridTable";
import SearchBar from "@/components/SearchBar";
import ActionButton from "@/components/ui/ActionButton";
import BeatLoader from "react-spinners/BeatLoader";
import useEquipmentIssues from "@/app/hooks/useEquipmentIssue";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "issueDate", headerName: "Issued Date", width: 250 },
    { field: "issuedBy", headerName: "Issued By", width: 250 },
    { field: "issuedTo", headerName: "Employee Name", width: 150 },
    { field: "reason", headerName: "Reason", width: 150 },
    {
        field:'items',
        headerName:'Items',
        width:500,
        renderCell: (params) =>
            params.row.items.map((item:any)=>
            `${item.name} (Issued:${item.quantity}) (Returned:${item.returnedQuantity})`
            ).join(" / ")
    },
    {field: 'status', headerName:"Status", width:100},
    {field: 'returnDate', headerName: "Returned Date", width:200}

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
    const router = useRouter();
    const {
    allIssues,
    filteredIssues,
    selectedIssueId,
    setSelectedIssueId,
    fetchIssues,
    } = useEquipmentIssues(searchQuery, selectedYear, selectedMonth)


    

    
  return (

    
    <div className="flex h-screen">
        <SideBar/>
        <div className="bg-[#F7F8FA] flex-1 p-8">
        <h2 className="text-2xl font-bold mb-2 text-black">Issued Equipments</h2>
        <div className="flex justify-between items-center mb-4">
            <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
            <div className="flex items-center gap-4">
                <select value={selectedYear || ""} 
                onChange={(e) => setSelectedYear(e.target.value || null)}
                className="border p-2 rounded-md text-black"
                >
                    <option value="">All Years</option>
                    {Array.from(
                        new Set(
                            allIssues.map((issue)=>
                            new Date(issue.issueDate).getFullYear()
                        )
                    )
                ).map((year)=>(
                    <option key={year} value={year}>
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
                        <option value={String(index + 1)} key={index}>
                            {month}
                        </option>
                    ))}
                </select>
            </div>
        </div>
        <div style={{height:400, width:'100%'}}>
            <DataGridTable
            rows={filteredIssues}
            columns={columns}
            onRowSelectionChange={setSelectedIssueId}
            />
        </div>  
        <div className="mt-4 flex flex-grow gap-5">
            <ActionButton color="primary" variant="contained" label="Update" onClick={() =>{
                if(!selectedIssueId){
                    Swal.fire('Error',"Select a Equipment Issue from the Grid",'error');
                    return;
                }
                window.location.href = `/issues/equipment/update/${selectedIssueId}`
            }} />
        </div>
    </div>
    </div>
  )
}

export default page