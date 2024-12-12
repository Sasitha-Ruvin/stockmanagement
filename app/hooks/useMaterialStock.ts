import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";

const useMaterialStock = (searchQuery:string)=>{
    const router = useRouter();
    const [allProducts, setAllProducts] = useState<any[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
    const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

    const fetchProducts = async () =>{
        try {
            const response = await fetch('/api/materialstock');
            const data = await response.json();
            const formattedData = data.map((product:any)=>({
                id:product.id,
                name:product.name,
                description:product.description,
                quantity:product.quantity,
                dateAdded:product.dateAdded ? new Date(product.dateAdded).toLocaleDateString():'',
                supplier:product.supplier,
                unitPrice:product.unitPrice,
            }));

            setAllProducts(formattedData);
            setFilteredProducts(formattedData);
            
        } catch (error) {
            console.error("Error fetching Materials: ", error);
            Swal.fire({
                title:'Error',
                text:"There was an error when fetching materials",
                icon:'error',
                confirmButtonText:'OK'
            });
            
        }
    };

    useEffect(()=>{
        if(searchQuery.trim()===''){
            setFilteredProducts(allProducts)
        }else{
            setFilteredProducts(
                allProducts.filter(product=>
                    product.name.toLowerCase().includes(searchQuery.toLowerCase())
                )
            );
        }
    },[searchQuery,allProducts]);

    useEffect(()=>{
        fetchProducts();
    },[]);

    const handleDelete = async () => {
        if (!selectedProductId) {
          Swal.fire("Error", "Select A Product to Remove", 'info');
          return;
        }
      
        Swal.fire({
          title: 'Are you sure you want to delete item from Stock?',
          text: "You will not be able to reverse this action",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#d33',
          cancelButtonColor: "#3085d6",
          confirmButtonText: 'Yes'
        }).then(async (result) => {
          if (result.isConfirmed) {
            Swal.fire({
              title: 'Deleting...',
              text: 'Please wait while deletion is processing',
              icon: 'info',
              showCancelButton: false,
              willOpen: () => {
                Swal.showLoading();
              }
            });
      
            try {
              const response = await fetch(`/api/materialstock/${selectedProductId}`, {
                method: 'DELETE',
              });
      
              if (!response.ok) {
                throw new Error("Failed to delete item");
              }
      
              Swal.fire({
                title: 'Item Deleted',
                text: "The Item has been removed from Stocks Successfully",
                icon: 'success',
                confirmButtonText: 'OK'
              }).then(() => {
                fetchProducts();
                setSelectedProductId(null);  // Reset the selection
              });
      
            } catch (error) {
              console.log('Error Deleting: ', error);
              Swal.fire({
                title: 'Error',
                text: 'There was an issue deleting the item',
                icon: 'error',
                confirmButtonText: 'OK'
              });
            }
          }
        });
      }
      

    return{
        allProducts,
        filteredProducts,
        selectedProductId,
        setSelectedProductId,
        handleDelete
    }
}

export default useMaterialStock