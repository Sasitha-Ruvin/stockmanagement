"use client";

import React, { useState, useEffect } from "react";
import { TextField, Button } from "@mui/material";
import { useRouter, useParams } from "next/navigation";
import Swal from "sweetalert2";
import SideBar from "@/components/SideBar";

interface EquipmentIssueItem {
  id: number;
  name: string;
  quantity: number;
  returnedQuantity: number;
}

interface FormData {
  returnDate: string;
  status: string;
  returnedItems: EquipmentIssueItem[];
}

const EquipmentIssueUpdatePage = () => {
  const router = useRouter();
  const { id } = useParams();

  const [formData, setFormData] = useState<FormData>({
    returnDate: "",
    status: "On Issue",
    returnedItems: [],
  });

  // Fetch Equipment Issue details
  const fetchIssueDetails = async () => {
    try {
      const response = await fetch(`/api/issues/equipment/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch Equipment Issue details");
      }
      const data = await response.json();

      setFormData({
        returnDate: data.returnDate ? data.returnDate.split("T")[0] : "",
        status: data.status || "On Issue",
        returnedItems: data.issueItems
          ? data.issueItems.map((item: any) => ({
              id: item.id,
              name: item.equipment.name,  // Ensure equipment data is valid
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
    if (id) {
      fetchIssueDetails();
    }
  }, [id]);

  // Handle field change for returnedQuantity, returnDate, and status
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, itemId?: number) => {
    const { name, value } = e.target;

    if (name === "returnDate") {
      setFormData((prev) => ({ ...prev, returnDate: value }));
    } else if (name === "status") {
      setFormData((prev) => ({ ...prev, status: value }));
    } else if (name === "returnedQuantity" && itemId !== undefined) {
      setFormData((prev) => ({
        ...prev,
        returnedItems: prev.returnedItems.map((item) =>
          item.id === itemId ? { ...item, returnedQuantity: parseInt(value) } : item
        ),
      }));
    }
  };

  // Handle form submission (Update)
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prepare data to update
    const updateData = {
      returnDate: formData.returnDate,
      status: formData.status,
      returnedItems: formData.returnedItems.map(item => ({
        id: item.id,  // Unique ID for issue item
        returnedQuantity: item.returnedQuantity,  // Update returned quantity
      })),
    };

    try {
      const response = await fetch(`/api/issues/equipment/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) throw new Error("Failed to update Equipment Issue");

      Swal.fire("Success", "Equipment Issue Updated Successfully", "success");
      router.push("/issues/equipment/index");  // Navigate after successful update
    } catch (error) {
      console.error("Error updating issue:", error);
      Swal.fire("Error", "Failed to update Equipment Issue", "error");
    }
  };

  return (
    <div className="flex h-screen">
      <SideBar />
      <div className="bg-[#F7F8FA] flex-1 p-8">
        <h2 className="text-2xl font-bold mb-4 text-black">Update Equipment Issue</h2>
        <form onSubmit={handleUpdate} className="space-y-6">
          {/* Return Date */}
          <TextField
            label="Return Date"
            type="date"
            name="returnDate"
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            value={formData.returnDate}
            onChange={(e) => handleChange(e)} 
            fullWidth
          />

          {/* Status */}
          <TextField
            label="Status"
            name="status"
            variant="outlined"
            value={formData.status}
            onChange={(e) => handleChange(e)} 
            fullWidth
          />

          {/* Items */}
          <div className="space-y-4">
            <h3 className="font-semibold">Issued Items</h3>
            {formData.returnedItems.map((item) => (
              <div key={item.id} className="bg-gray-100 p-4 rounded-md">
                <p>
                  <strong>{item.name}</strong> (Qty: {item.quantity}) - Returned: {item.returnedQuantity}
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

          <Button type="submit" variant="contained" color="primary" className="mt-6">
            Update Issue
          </Button>
        </form>
      </div>
    </div>
  );
};

export default EquipmentIssueUpdatePage;
