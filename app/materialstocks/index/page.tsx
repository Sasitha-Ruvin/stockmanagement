"use client";

import React, { useState } from "react";
import { GridColDef } from "@mui/x-data-grid";
import SideBar from "@/components/SideBar";
import DataGridTable from "@/components/DataGridTable";
import SearchBar from "@/components/SearchBar";
import ActionButton from "@/components/ui/ActionButton";
import BeatLoader from "react-spinners/BeatLoader";
import useEquipmentIssues from "@/app/hooks/useEquipmentIssue";
import Swal from "sweetalert2";

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "issueDate", headerName: "Issue Date", width: 150 },
  { field: "issuedBy", headerName: "Issued By", width: 150 },
  { field: "issuedTo", headerName: "Issued To", width: 150 },
  { field: "reason", headerName: "Reason", width: 200 },
  { field: "totalItems", headerName: "Total Items", width: 120 },
];

const EquipmentIssuesPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);

  const {
    allIssues,
    filteredIssues,
    selectedIssueId,
    setSelectedIssueId,
    fetchIssues,
  } = useEquipmentIssues(searchQuery, selectedYear, selectedMonth);

  return (
    <div className="flex h-screen">
      <SideBar />
      <div className="bg-[#F7F8FA] flex-1 p-8">
        <h2 className="text-2xl font-bold mb-2 text-black">Equipment Issues</h2>

        <div className="flex justify-between items-center mb-4">
          <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          <ActionButton
            label="Issue Equipments"
            link="/issues/equipment/create"
            variant="contained"
            color="primary"
          />
        </div>

        {/* Show loading spinner while data is fetching */}
        {allIssues.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <BeatLoader color="#000000" />
          </div>
        ) : (
          <div style={{ height: 400, width: "100%" }}>
            <DataGridTable
              rows={filteredIssues}
              columns={columns}
              onRowSelectionChange={setSelectedIssueId}
            />
          </div>
        )}

        <div className="mt-4">
          <div className="flex gap-4">
            <ActionButton label="Update"/>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default EquipmentIssuesPage;
