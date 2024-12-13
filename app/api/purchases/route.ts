import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";


export async function GET() {
    try {
        const purchases = await prisma.purchase.findMany({
            include:{
                purchaseItems:{
                    include:{
                        material:true
                    }
                }
            }
        });
        return NextResponse.json(purchases);
        
    } catch (error) {

        console.error(error);
        return NextResponse.json({error:"Failed to Fetch Material Purchases"},{status:500})
        
    }
}

export async function POST(request:Request) {
    const formData = await request.formData();
    try {
        const purchaseDate = formData.get('purchaseDate')?.toString();
        const items = formData.get("items")?.toString();

        if(!purchaseDate || !items){
            return NextResponse.json(
                {error:'Missing Required Fields : purchaseDate or items'},
                {status:400}
            );
        }

        const parsedItems = JSON.parse(items);
        if(!Array.isArray(parsedItems) ||parsedItems.length === 0){
            return NextResponse.json({error:"Invalid Items Format"},{status:400})
        }

        const newPurchase = await prisma.purchase.create({
            data:{
                purchaseDate:new Date(purchaseDate),
                purchaseItems:{
                    create:parsedItems.map((items:any)=>({
                        materialId:parseInt(items.materialId,10),
                        quantity:parseInt(items.quantity,10),
                    })),
                },
            },
        });
        
        return NextResponse.json(newPurchase,{status:201})
        
    } catch (error) {
        console.log(error);
        return NextResponse.json({error:"Failed to Create Purchase"},{status:500})
        
    }
    
}