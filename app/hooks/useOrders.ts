import { useState, useEffect } from "react";
import Swal from "sweetalert2";

const useOrder = (
    searchQuery:string,
    selectedYear:string | null,
    selectedMonth:string | null
)=>{
    const [allOrders, setAllOrders] = useState<any[]>([]);
    const [filteredOrders, setFilteredOrders] = useState<any[]>([]);
    const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

    const fetchOrders = async () => {
        try {
            const response = await fetch('/api/order');
            const data = await response.json();

            const formattedData = data.map((order:any)=>{
                return{
                    id:order.id,
                    issueDate: new Date(order.issueDate).toDateString(),
                    returnDate: new Date(order.returnDate).toDateString(),
                    client:order.client,
                    clinetContact: order.clinetContact, 
                    status:order.status,
                    items:order.rentitems.map((item:any) => ({
                        name:item.rentalstock?.name,
                        quantity:item.quantity,
                        returnedQuantity:item.returnedQuantity,
                    })),
                };
            });

            setAllOrders(formattedData);
            setFilteredOrders(formattedData)
        } catch (error) {
            console.error("Error fetching equipment issues:", error);
                  Swal.fire({
                    title: "Error",
                    text: "There was an issue Rents.",
                    icon: "error",
                    confirmButtonText: "OK",
            });
        }
    };

    useEffect(()=>{
        fetchOrders();
    },[]);

    useEffect(() =>{
        let filtered = allOrders;

        if(searchQuery){
            const lowerCaseQuery = searchQuery.toLowerCase();
            filtered = filtered.filter((order) =>{
                const matchesClient = order.client
                .toLowerCase()
                .includes(lowerCaseQuery);

                const matchesItemName = order.items.name((item:any)=>
                item.name.toLowerCase().includes(lowerCaseQuery)
            );

            return matchesClient || matchesItemName;
         });
        }

        if(selectedYear){
            filtered = filtered.filter(
                (order) =>
                    new Date(
                        order.issueDate.split("-").reverse().join("-")
                    ).getFullYear().toString() === selectedYear
            );
        }

        if(selectedMonth){
            filtered = filtered.filter(
                (order) =>
                    new Date(
                        order.issueDate.split("-").reverse().join("-")
                    ).getMonth() + 1 === parseInt(selectedMonth)
            );
        }
        setFilteredOrders(filtered);
    }, [searchQuery, selectedYear, selectedMonth, allOrders]);

    return{
         allOrders,
         filteredOrders, 
         selectedOrderId,
         setSelectedOrderId,
         fetchOrders
    };
};

export default useOrder;