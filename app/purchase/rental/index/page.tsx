"use client";
import React, { useState } from "react";
import { GridColDef } from "@mui/x-data-grid";
import SideBar from "@/components/SideBar";
import DataGridTable from "@/components/DataGridTable";
import SearchBar from "@/components/SearchBar";
import ActionButton from "@/components/ui/ActionButton";
import useRentalPurchases from "@/app/hooks/useRentalPurchase";

const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "purchaseDate", headerName: "Purchased Date", width: 120 },
    { field: "totalItems", headerName: "Total Items", width: 70 },
    { field: "supplier", headerName: "Supplier/s", width: 200 },
    {
      field: "items",
      headerName: "Items",
      width: 300,
      renderCell: (params) =>
        params.row.items
          .map(
            (item: any) =>
              `${item.name} (Qty: ${item.quantity}) (UnitPrice: ${item.unitPrice}) (Total: ${item.unitTotal})`
          )
          .join(", "),
    },
    { field: "reason", headerName: "Purchase Reason", width: 200 },
    { field: "total", headerName: "Total Cost", width: 120 },
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
     const [searchQuery, setSearchQuery] = useState("");
      const [selectedYear, setSelectedYear] = useState<string | null>(null);
      const [selectedMonth, setSelectedMonth] = useState<string | null>(null); 
      const {
        allPurchases,
        filteredPurchases,
        selectedPurchaseId,
        setSelectedPurchaseId,
        fetchRentalPurchases,
      } = useRentalPurchases(searchQuery,selectedYear,selectedMonth);
  return (
    <div className="flex h-screen">
      <SideBar />
      <div className="bg-[#F7F8FA] flex-1 p-8">
        <h2 className="text-2xl font-bold mb-2 text-black">Rental Purchases</h2>

        <div className="flex justify-between items-center mb-4">
          <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          <div className="flex items-center gap-4">
            {/* Add Year Filter Dropdown */}
            <select
              value={selectedYear || ""}
              onChange={(e) => setSelectedYear(e.target.value || null)}
              className="border p-2 rounded-md text-black"
            >
              <option value="">All Years</option>
              {/* Dynamically populate unique years */}
              {Array.from(
                new Set(
                  allPurchases.map((purchase) =>
                    new Date(purchase.purchaseDate).getFullYear()
                  )
                )
              ).map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>

            {/* Add Month Filter Dropdown */}
            <select
              value={selectedMonth || ""}
              onChange={(e) => setSelectedMonth(e.target.value || null)}
              className="border p-2 rounded-md text-black"
            >
              <option value="">All Months</option>
              {months.map((month, index) => (
                <option key={index} value={String(index + 1)}>
                  {month}
                </option>
              ))}
            </select>
          </div>
          <ActionButton label="New Purchase" link="/purchase/rental/create" />
        </div>

        <div style={{ height: 400, width: "100%" }}>
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