import { useState, useEffect } from "react";
import Swal from "sweetalert2";

const useMaterialPurchases = (
  searchQuery: string,
  selectedYear: string | null,
  selectedMonth: string | null
) => {
  const [allPurchases, setAllPurchases] = useState<any[]>([]);
  const [filteredPurchases, setFilteredPurchases] = useState<any[]>([]);
  const [selectedPurchaseId, setSelectedPurchaseId] = useState<string | null>(
    null
  );

  const fetchPurchases = async () => {
    try {
      const response = await fetch("/api/purchases/material");
      const data = await response.json();

      const formattedData = data.map((purchase: any) => { // DD-MM-YYYY

        return {
          id: purchase.id,
          purchaseDate: new Date(purchase.purchaseDate).toDateString(),
          totalItems: purchase.purchaseItems?.length || 0,
          supplier: purchase.supplier,
          reason: purchase.purchase,
          total: purchase.total.toFixed(2),
          items: purchase.purchaseItems.map((item: any) => ({
            name: item.material?.name,
            quantity: item.quantity,
            unitPrice: item.unitPrice.toFixed(2),
            unitTotal: item.unitTotal.toFixed(2),
          })),
        };
      });

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
    let filtered = allPurchases;

    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      filtered = filtered.filter((purchase) => {
        const matchesSupplier = purchase.supplier
          .toLowerCase()
          .includes(lowerCaseQuery);

        const matchesItemName = purchase.items.some((item: any) =>
          item.name.toLowerCase().includes(lowerCaseQuery)
        );

        return matchesSupplier || matchesItemName;
      });
    }

    if (selectedYear) {
      filtered = filtered.filter(
        (purchase) =>
          new Date(
            purchase.purchaseDate.split("-").reverse().join("-")
          ).getFullYear().toString() === selectedYear
      );
    }

    if (selectedMonth) {
      filtered = filtered.filter(
        (purchase) =>
          new Date(
            purchase.purchaseDate.split("-").reverse().join("-")
          ).getMonth() + 1 === parseInt(selectedMonth)
      );
    }

    setFilteredPurchases(filtered);
  }, [searchQuery, selectedYear, selectedMonth, allPurchases]);

  return {
    allPurchases,
    filteredPurchases,
    selectedPurchaseId,
    setSelectedPurchaseId,
    fetchPurchases,
  };
};

export default useMaterialPurchases;
