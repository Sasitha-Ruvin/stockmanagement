// usePurchases.ts

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

const usePurchases = (searchQuery: string) => {
  const router = useRouter();
  const [allPurchases, setAllPurchases] = useState<any[]>([]);
  const [filteredPurchases, setFilteredPurchases] = useState<any[]>([]);
  const [selectedPurchaseId, setSelectedPurchaseId] = useState<string | null>(null);

  const fetchPurchases = async () => {
    try {
      const response = await fetch("/api/purchases/material");
      const data = await response.json();

      const formattedData = data.map((purchase: any) => ({
        id: purchase.id,
        purchaseDate: new Date(purchase.purchaseDate).toLocaleDateString(),
        totalItems: purchase.purchaseItems?.length || 0,
        items: purchase.purchaseItems.map((item: any) => ({
          name: item.material?.name,
          quantity: item.quantity,
        })),
      }));

      setAllPurchases(formattedData);
      setFilteredPurchases(formattedData);
    } catch (error) {
      console.error("Error fetching purchases:", error);
      Swal.fire({
        title: "Error",
        text: "There was an issue fetching purchases.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  useEffect(() => {
    fetchPurchases();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      setFilteredPurchases(
        allPurchases.filter((purchase) =>
          purchase.supplierName.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    } else {
      setFilteredPurchases(allPurchases);
    }
  }, [searchQuery, allPurchases]);

//   const handleDeletePurchase = async () => {
//     if (!selectedPurchaseId) {
//       Swal.fire("Error", "Please select a purchase to delete", "info");
//       return;
//     }

//     Swal.fire({
//       title: "Are you sure you want to delete this purchase?",
//       text: "You will not be able to reverse this action",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#d33",
//       cancelButtonColor: "#3085d6",
//       confirmButtonText: "Yes",
//     }).then(async (result) => {
//       if (result.isConfirmed) {
//         Swal.fire({
//           title: "Deleting...",
//           text: "Please wait while removing the purchase",
//           icon: "info",
//           showConfirmButton: false,
//           willOpen: () => {
//             Swal.showLoading();
//           },
//         });

//         try {
//           const response = await fetch(`/api/purchases/${selectedPurchaseId}`, {
//             method: "DELETE",
//           });

//           if (!response.ok) {
//             throw new Error("Failed to delete purchase");
//           }

//           Swal.fire({
//             title: "Purchase Deleted",
//             text: "The purchase has been deleted successfully.",
//             icon: "success",
//             confirmButtonText: "OK",
//           }).then(() => {
//             fetchPurchases();
//             setSelectedPurchaseId(null);
//           });
//         } catch (error) {
//           console.error("Error deleting purchase:", error);
//           Swal.fire({
//             title: "Error",
//             text: "There was an issue deleting the purchase.",
//             icon: "error",
//             confirmButtonText: "OK",
//           });
//         }
//       }
//     });
//   };

  return {
    allPurchases,
    filteredPurchases,
    selectedPurchaseId,
    setSelectedPurchaseId,
    fetchPurchases,
  };
};

export default usePurchases;
