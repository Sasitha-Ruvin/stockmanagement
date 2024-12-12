import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { error } from "console";

export async function GET(request:Request, {params}:{params :{ id:string}}) {
    try {
        const { id } = await params;
        const productId = parseInt(id,10);
        const product = await prisma.materialStock.findUnique({
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

        const updatedProduct = await prisma.materialStock.update({
            where:{id:productId},
            data:{
                name:data.name,
                description:data.description,
                quantity:data.quantity,
                supplier:data.supplier,
                dateAdded:data.dateAdded ? new Date(data.dateAdded) : null,
                unitPrice:data.unitPrice
            },
        });
        return NextResponse.json(updatedProduct,{status:200});
        
    } catch (error) {
        console.error('Error fetching Item:', error);
        return NextResponse.json({ error: 'Failed to fetch Item' }, { status: 500 });
        
    }
    
}