import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { error } from "console";

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

export async function POST(request: Request) {
    const formData = await request.formData();
    try {
        const purchaseDate = formData.get("purchaseDate")?.toString();
        const items = formData.get("items")?.toString();
        const total = parseFloat(formData.get('total')?.toString() || '0');
        const supplier = formData.get('supplier')?.toString();
        const reason = formData.get('reason')?.toString();

        if (!purchaseDate || !items) {
            return NextResponse.json(
                { error: "Missing Required Fields: purchaseDate or items" },
                { status: 400 }
            );
        }

        const parsedItems = JSON.parse(items);
        if (!Array.isArray(parsedItems) || parsedItems.length === 0) {
            return NextResponse.json({ error: "Invalid Items Format" }, { status: 400 });
        }

        // Start a Prisma transaction
        const transaction = await prisma.$transaction(async (prismaTransaction) => {
            // Create the new purchase
            const newPurchase = await prismaTransaction.purchase.create({
                data: {
                    purchaseDate: new Date(purchaseDate),
                    total:total,
                    supplier:supplier,
                    purchase:reason,
                    purchaseItems: {
                        create: parsedItems.map((item: any) => ({
                            materialId: parseInt(item.materialId, 10),
                            quantity: parseInt(item.quantity, 10),
                            unitPrice:parseFloat(item.unitPrice),
                            unitTotal:parseFloat(item.unitTotal)
                        })),
                    },
                },
            });

            // Update the material quantities
            for (const item of parsedItems) {
                await prismaTransaction.material.update({
                    where: { id: parseInt(item.materialId, 10) },
                    data: {
                        quantity: {
                            increment: parseInt(item.quantity, 10),
                        },
                    },
                });
            }

            return newPurchase;
        });

        return NextResponse.json(transaction, { status: 201 });
    } catch (error) {
        console.error("Error creating purchase:", error);
        return NextResponse.json({ error: "Failed to Create Purchase" }, { status: 500 });
    }
}