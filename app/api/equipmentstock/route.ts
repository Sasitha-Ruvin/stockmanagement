import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";


export async function GET(){
    try {
        const equipment = await prisma.equipmentStock.findMany({
            where:{
                isDeleted:false,
            },
        });
        return NextResponse.json(equipment)
        
    } catch (error) {
        console.log(error)
        return NextResponse.json({error:'Error in fetching'},{status:500})
    }
    
}

export async function POST(request:Request) {

    const formData = await request.formData();

    try {
        const name = formData.get('name')?.toString();
        const description = formData.get('description')?.toString();
        const quantity = formData.get('quantity')?.toString();
        const supplier = formData.get('supplier')?.toString();
        const unitPrice = formData.get('unitPrice')?.toString();


        if(!name || !quantity || !unitPrice){
            return NextResponse.json({error:'Missing Fields'},{status:400});
        }

        const parsedQuantity = parseInt(quantity,10);
        const parsedUnitPrice = parseFloat(unitPrice);

        if(isNaN(parsedQuantity) || isNaN(parsedUnitPrice)){
            return NextResponse.json({error:"Invalid Quality or Unit Price"}, {status:400});
        }

        const newItem = await prisma.equipmentStock.create({
            data:{
                name,
                description,
                quantity:parsedQuantity,
                supplier,
                unitPrice:parsedUnitPrice
            },
        });

        return NextResponse.json(newItem,{status:201});
        
    } catch (error) {
        console.log(error)
        return NextResponse.json({error:'Erro Adding'},{status:500});
        
    }
    
}