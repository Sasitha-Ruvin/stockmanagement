import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";


export async function GET() {
    try {
        const rentalitems = await prisma.rentalStocks.findMany({
            where:{
                isDeleted:false,
            },
        });

        return NextResponse.json(rentalitems)
    } catch (error) {
        return NextResponse.json({error:'Failed to fetch Rental Stock'},{status:500})
    } 
}

export async function POST(request:Request) {
    const formData = await request.formData();
    try {
        const name = formData.get('name')?.toString();
        const description = formData.get('description')?.toString();
        const quantity = formData.get('quantity')?.toString();
        const unitPrice = formData.get('unitPrice')?.toString();

        if(!name || !quantity ){
            return NextResponse.json({error:"Missing Requied Fields"})
        }

        const parsedQuantity = parseInt(quantity, 0);

        if(isNaN(parsedQuantity)){
            return NextResponse.json({error:'Invalid Quantity'});
        }

        const newItem = await prisma.rentalStocks.create({
            data:{
                name,
                description,
                quantity:parsedQuantity
            },
        });
        return NextResponse.json(newItem,{status:201})

    } catch (error) {
        console.log("Error Creating Item", error);
        return NextResponse.json({error:'Failed to Create Item'},{status:500})
        
    }
    
}