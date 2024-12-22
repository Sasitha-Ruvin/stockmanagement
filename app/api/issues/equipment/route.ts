import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const issues = await prisma.equipmentIssue.findMany({
            include:{
                issueItems:{
                    include:{
                        equipment:true
                    }
                }
            }
        });
        return NextResponse.json(issues)
    } catch (error) {

        console.log(error)
        return NextResponse.json({error:"Failed to Fetch Material Purchases"},{status:500})
        
    }
    
}

export async function POST(request: Request) {
    const formData = await request.formData();
    try {
        const issueDate = formData.get('issueDate')?.toString();
        const issueReason = formData.get('issueReason')?.toString();
        const issuedBy = formData.get('issuedBy')?.toString();
        const issuedTo = formData.get('issuedTo')?.toString();
        const items = formData.get("items")?.toString();

        if (!issueDate || !items || !issuedBy || !issuedTo) {
            return NextResponse.json(
                { error: "Missing Required Fields: Issue Date, Items, Issued By, or Issued To" },
                { status: 400 }
            );
        }

        const parsedItems = JSON.parse(items);
        if (!Array.isArray(parsedItems) || parsedItems.length === 0) {
            return NextResponse.json({ error: "Invalid Items Format" }, { status: 400 });
        }

        const transaction = await prisma.$transaction(async (prismaTransaction) => {
            const newIssue = await prismaTransaction.equipmentIssue.create({
                data: {
                    issueDate: new Date(issueDate),
                    issueReason,
                    issuedBy,
                    issuedTo,
                    status: 'On Issue',
                    issueItems: {
                        create: parsedItems.map((item: any) => ({
                            equipmentId: parseInt(item.equipmentId, 10),
                            quantity: parseInt(item.quantity, 10),
                        })),
                    },
                },
            });

            for (const item of parsedItems) {
                await prismaTransaction.equipmentStock.update({
                    where: { id: parseInt(item.equipmentId, 10) },
                    data: {
                        quantity: {
                            decrement: parseInt(item.quantity, 10),
                        },
                    },
                });
            }
            return newIssue;
        });
        return NextResponse.json(transaction, { status: 201 });
    } catch (error) {
        console.error("Error Creating Equipment Issue: ", error);
        return NextResponse.json({ error: "Failed to Create Equipment Issue" }, { status: 500 });
    }
}
