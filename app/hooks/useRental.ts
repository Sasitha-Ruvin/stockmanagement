import { useState, useEffect } from "react";
import Swal from "sweetalert2";

const useRental = (searchQuery:string) =>{
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false); // Add loading state

  const fetchProducts = async () =>{
    setLoading(true);
    try {
        const response = await fetch("/api/rentalstock");
        const data = await response.json();
        const formattedData = data.map((product:any) =>({
            id:product.id,
            name: product.name,
            description:product.description,
            quantity:product.quantity
        }));

        setAllProducts(formattedData);
        setFilteredProducts(formattedData);
    } catch (error) {
        console.log("Error Fetching Materials: ", error);
          Swal.fire({
                title: "Error",
                text: "There was an error when fetching materials",
                icon: "error",
                confirmButtonText: "OK",
            });
        
    }
    finally{
        setLoading(false);
    }
  }

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredProducts(allProducts);
    } else {
      setFilteredProducts(
        allProducts.filter((product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }
  }, [searchQuery, allProducts]);

  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    allProducts,
    filteredProducts,
    selectedProductId,
    setSelectedProductId,
    loading, // Return loading state
  };


}


export default useRental;