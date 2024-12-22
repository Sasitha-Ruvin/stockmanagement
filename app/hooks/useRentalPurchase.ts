import { useState, useEffect } from "react";
import Swal from "sweetalert2";

const useRentalPurchases = (
  searchQuery: string,
  selectedYear: string | null,
  selectedMonth: string | null
) => {
  const [allPurchases, setAllPurchases] = useState<any[]>([]);
  const [filteredPurchases, setFilteredPurchases] = useState<any[]>([]);
  const [selectedPurchaseId, setSelectedPurchaseId] = useState<string | null>(
    null
  );

  const fetchRentalPurchases = async () => {
    try {
      const response = await fetch("/api/purchases/rental");
      const data = await response.json();

      const formattedData = data.map((purchase: any) => {
        return {
          id: purchase.id,
          purchaseDate: new Date(purchase.purchaseDate).toDateString(),
          totalItems: purchase.purchaseItems?.length || 0,
          supplier: purchase.supplier,
          reason: purchase.reason,
          total: purchase.total?.toFixed(2) || "0.00",
          items: purchase.purchaseItems.map((item: any) => ({
            name: item.rentalstock?.name,
            quantity: item.quantity,
            unitPrice: item.unitPrice?.toFixed(2) || "0.00",
            unitTotal: item.unitTotal?.toFixed(2) || "0.00",
          })),
        };
      });

      setAllPurchases(formattedData);
      setFilteredPurchases(formattedData);
    } catch (error) {
      console.error("Error fetching rental purchases:", error);
      Swal.fire({
        title: "Error",
        text: "There was an issue fetching rental purchases.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  useEffect(() => {
    fetchRentalPurchases();
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
          new Date(purchase.purchaseDate).getFullYear().toString() ===
          selectedYear
      );
    }

    if (selectedMonth) {
      filtered = filtered.filter(
        (purchase) =>
          new Date(purchase.purchaseDate).getMonth() + 1 ===
          parseInt(selectedMonth)
      );
    }

    setFilteredPurchases(filtered);
  }, [searchQuery, selectedYear, selectedMonth, allPurchases]);

  return {
    allPurchases,
    filteredPurchases,
    selectedPurchaseId,
    setSelectedPurchaseId,
    fetchRentalPurchases,
  };
};

export default useRentalPurchases;
