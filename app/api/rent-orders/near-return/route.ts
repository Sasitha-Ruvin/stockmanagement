import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    const today = new Date();
    const twoDaysLater = new Date(today);
    twoDaysLater.setDate(today.getDate() + 2);

    try {
        const nearReturnOrders = await prisma.rentOrder.findMany({
            where:{
                returnDate:{
                    gte:today,
                    lte:twoDaysLater,
                },
                status: "On Rent",
            },
            select:{
                id:true,
                client:true,
                clinetContact:true,
                returnDate:true,
            },
        });

        return NextResponse.json(nearReturnOrders);
    } catch (error) {

        console.log(error)
        return NextResponse.json({error:"Error fetch"}, {status:500})
        
    }
    
}