import { useState, useEffect } from "react";
import Swal from "sweetalert2";

const useEquipmentIssues = (
  searchQuery: string,
  selectedYear: string | null,
  selectedMonth: string | null
) => {
  const [allIssues, setAllIssues] = useState<any[]>([]);
  const [filteredIssues, setFilteredIssues] = useState<any[]>([]);
  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null);

  const fetchIssues = async () => {
    try {
      const response = await fetch("/api/issues/equipment");
      const data = await response.json();
  
      const formattedData = data.map((issue: any) => {
        return {
          id: issue.id,
          issueDate: new Date(issue.issueDate).toDateString(),
          issuedBy: issue.issuedBy,
          returnDate: issue.returnDate
          ? new Date(issue.returnDate).toLocaleDateString() // Format returnDate in short format
          : 'Not Available', 
          issuedTo: issue.issuedTo,
          status:issue.status,
          reason: issue.issueReason, // Access the reason properly from issue
          totalItems: issue.issueItems?.length || 0,
          items: issue.issueItems.map((item: any) => ({
            name: item.equipment?.name, // Ensure equipment name is correctly referenced
            quantity: item.quantity,
            returnedQuantity: item.returnedQuantity,
          })),
        };
      });
  
      setAllIssues(formattedData);
      setFilteredIssues(formattedData);
    } catch (error) {
      console.error("Error fetching equipment issues:", error);
      Swal.fire({
        title: "Error",
        text: "There was an issue fetching equipment issues.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };
  

  useEffect(() => {
    fetchIssues();
  }, []);

  useEffect(() => {
    let filtered = allIssues;

    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      filtered = filtered.filter((issue) => {
        const matchesIssuer = issue.issuedBy
          .toLowerCase()
          .includes(lowerCaseQuery);

        const matchesReceiver = issue.issuedTo
          .toLowerCase()
          .includes(lowerCaseQuery);

        const matchesItemName = issue.items.some((item: any) =>
          item.name.toLowerCase().includes(lowerCaseQuery)
        );

        return matchesIssuer || matchesReceiver || matchesItemName;
      });
    }

    if (selectedYear) {
      filtered = filtered.filter(
        (issue) =>
          new Date(
            issue.issueDate.split("-").reverse().join("-")
          ).getFullYear().toString() === selectedYear
      );
    }

    if (selectedMonth) {
      filtered = filtered.filter(
        (issue) =>
          new Date(
            issue.issueDate.split("-").reverse().join("-")
          ).getMonth() + 1 === parseInt(selectedMonth)
      );
    }

    setFilteredIssues(filtered);
  }, [searchQuery, selectedYear, selectedMonth, allIssues]);

  return {
    allIssues,
    filteredIssues,
    selectedIssueId,
    setSelectedIssueId,
    fetchIssues,
  };
};

export default useEquipmentIssues;
