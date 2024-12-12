import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { error } from "console";

export async function GET(request:Request, {params}:{params :{ id:string}}) {
    try {
        const { id } = await params;
        const productId = parseInt(id,10);
        const product = await prisma.material.findUnique({
            where:{id:productId}
        })

        if(!product){
            return NextResponse.json({error:'Item Not Found'},{status:404});
        }
        return NextResponse.json(product,{status:200});
        
    } catch (error) {
        console.log('Error Fetching Product: ', error);
        return NextResponse.json({error:'Failed to fetch Item'},{status:500});    
    }
    
}

export async function PUT(request:Request, {params}:{params:{id:string}}) {
    try {
        const { id } = await params;
        const productId = parseInt(id,10);
        const data = await request.json();

        if(isNaN(productId)){
            return NextResponse.json({error:'Invalid Item ID'}, {status:404})
        }

        const updatedProduct = await prisma.material.update({
            where:{id:productId},
            data:{
                name:data.name,
                description:data.description,
                quantity:data.quantity,
                supplier:data.supplier,
                unitPrice:data.unitPrice
            },
        });
        return NextResponse.json(updatedProduct,{status:200});
        
    } catch (error) {
        console.error('Error fetching Item:', error);
        return NextResponse.json({ error: 'Failed to fetch Item' }, { status: 500 });
        
    }
    
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
      const { id } = params;
      if (!id) {
        return NextResponse.json({ error: 'Invalid ID Format' }, { status: 400 });
      }
  
      const itemID = parseInt(id, 10);
      if (isNaN(itemID)) {
        return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
      }
  
      // Check if the item exists first
      const product = await prisma.material.findUnique({
        where: { id: itemID },
      });
  
      if (!product) {
        return NextResponse.json({ error: 'Item not found' }, { status: 404 });
      }
  
      // Perform delete
      await prisma.material.delete({
        where: { id: itemID },
      });
  
      return NextResponse.json({ message: 'Item successfully deleted' }, { status: 200 });
    } catch (error) {
      console.error('Error Deleting Item', error);
      return NextResponse.json({ error: 'Failed to Delete Item' }, { status: 500 });
    }
  }
  