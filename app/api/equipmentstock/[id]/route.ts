import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { error } from "console";

export async function GET(request:Request, {params}:{params: {id:string}}) {
    try {
        const {id} = await params;
        const equipmentId = parseInt(id,10);
        const product = await prisma.equipmentStock.findUnique({
            where:{id:equipmentId}
        })

        if(!product){
            return NextResponse.json({error:'Item Not Found'},{status:404});
        }
        return NextResponse.json(product,{status:200});
        
    } catch (error) {
        console.log('Error Fetching', error)
        return NextResponse.json({error:'Failed to Fetch'},{status:500});
        
    }
    
}

export async function PUT(request:Request, {params}:{params:{id:string}}){
    try {
        const { id } = await params;
        const equipmentId = parseInt(id,10);
        const data = await request.json();

        if(isNaN(equipmentId)){
            return NextResponse.json({error:'Invalid Item ID'}, {status:404})
        }
        const updatedProduct = await prisma.equipmentStock.update({
            where:{id:equipmentId},
            data:{
                name:data.name,
                description:data.description,
                quantity:data.quantity,
                supplier:data.supplier,
                unitPrice:data.unitPrice
            },
        });
        return NextResponse.json(updatedProduct,{status:200})
        
    } catch (error) {

        console.log(error);
        return NextResponse.json({error:"failed to update"},{status:500})
        
    }
}