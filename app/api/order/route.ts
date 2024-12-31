import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { error } from "console";

export async function GET() {
    try {
        const rents = await prisma.rentOrder.findMany({
            include:{
                rentitems:{
                    include:{
                        rentalstock:true
                    }
                }
            }
        });
        return NextResponse.json(rents)
    } catch (error) {
        console.log(error)
        return NextResponse.json({error:"Failed to Fetch Rents"},{status:500})
        
    }
    
}

export async function POST(request:Request) {
    const formData = await request.formData();
    try {
        const issueDate = formData.get('issueDate')?.toString();
        const returnDate = formData.get('returnDate')?.toString();
        const client = formData.get('client')?.toString();
        const clinetContact = formData.get('clientContact')?.toString() || "";
        const items = formData.get("items")?.toString() || "[]";

        if(!issueDate || !returnDate || !client){
            return NextResponse.json(
                {error:"Missing Required Fields: Issued Date, Return Date or Client"},
                {status:400}
            );
        }

        const parsedItems = JSON.parse(items);
        if(!Array.isArray(parsedItems) || parsedItems.length === 0){
            return NextResponse.json({ error: "Invalid Items Format" }, { status: 400 });
        }

        const transaction = await prisma.$transaction(async(prismaTransaction) =>{
            const newOrder = await prismaTransaction.rentOrder.create({
                data:{
                    issueDate: new Date(issueDate),
                    returnDate: new Date(returnDate),
                    client,
                    clinetContact: clinetContact,
                    status: "On Rent",
                    rentitems:{
                        create:parsedItems.map((item:any) =>({
                            rentalstockid:parseInt(item.rentalstockid, 10),
                            quantity:parseInt(item.quantity, 10)
                        })),
                    },
                },
            });

            for (const item of parsedItems){
                await prismaTransaction.rentalStocks.update({
                    where:{id:parseInt(item.rentalstockid,10)},
                    data:{
                        quantity:{
                            decrement:parseInt(item.quantity,10),
                        },
                    },
                });
            }
            return newOrder;
        });
        return NextResponse.json(transaction,{status:201})    
    } catch (error) {
        console.error("Error Creating Order: ", error);
        return NextResponse.json({ error: "Failed to Create Rent" }, { status: 500 });
        
    }

    
}