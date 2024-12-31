import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { error } from "console";

export async function GET(request: Request, { params }: { params: { id: string } }) {
    const { id } = params;

    try {
        const order = await prisma.rentOrder.findUnique({
            where: { id: Number(id) },
            include: {
                rentitems: {
                    include: {
                        rentalstock: true, // Ensure rentalstock is included
                    },
                },
            },
        });

        if (!order) {
            return new Response('Not Found', { status: 404 });
        }

        return new Response(JSON.stringify(order), { status: 200 });
    } catch (error) {
        console.error('Error fetching order:', error);
        return new Response(JSON.stringify({ error: 'Failed to fetch order details' }), { status: 500 });
    }
}


export async function PUT(request:Request, {params}:{params: {id:string}}) {
    const { id } = await params;

    const {status, returnedItems }:{status:string; returnedItems: {id:number; returnedQuantity:number } []} =
    await request.json();

    try {
        if(!returnedItems){
            return NextResponse.json({message:"No Returned Items Provided"},{status:400});
        }
        if(Array.isArray(returnedItems) && returnedItems.length > 0){
            const updateOrder = await prisma.rentOrder.update({
                where:{id:parseInt(id,10)},
                data:{
                    status,
                    rentitems:{
                        updateMany:returnedItems.map((item)=>({
                            where:{ id: item.id},
                            data: {returnedQuantity: item.returnedQuantity},
                        })),
                    },
                },
                include:{
                    rentitems:{
                        include:{
                            rentalstock:true,
                        },
                    },
                },
            });

            for (const item of returnedItems){
                const rentalstocks = updateOrder.rentitems.find((rentItem) => rentItem.id === item.id)?.rentalstock;

                if(rentalstocks){
                    await prisma.rentalStocks.update({
                        where:{id: rentalstocks.id},
                        data:{
                            quantity: {increment:item.returnedQuantity},
                        },
                    });
                }
            }
            return NextResponse.json(updateOrder)
        }else{
            return NextResponse.json({ message: 'Invalid returnedItems data' }, { status: 400 });
        }
    } catch (error) {
        console.error('Error updating Order:', error);
      return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
        
    }
    
}