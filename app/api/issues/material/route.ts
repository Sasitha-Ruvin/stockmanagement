import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { error } from "console";

export async function GET() {
    try {
        const issues = await prisma.materialIssue.findMany({
            include:{
                issueItems:{
                    include:{
                        material:true
                    }
                }
            }
        });
        return NextResponse.json(issues)
        
    } catch (error) {

        console.log(error)
        return NextResponse.json({error:"Failed to Fetch Material Issues"},{status:500})
        
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
            const newIssue = await prismaTransaction.materialIssue.create({
                data: {
                    issueDate: new Date(issueDate),
                    issueReason,
                    issuedBy,
                    issuedTo,
                    issueItems: {
                        create: parsedItems.map((item: any) => ({
                            materialId: parseInt(item.materialId, 10),
                            quantity: parseInt(item.quantity, 10),
                        })),
                    },
                },
            });

            for (const item of parsedItems) {
                await prismaTransaction.material.update({
                    where: { id: parseInt(item.materialId, 10) },
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
        console.error("Error Creating Issue: ", error);
        return NextResponse.json({ error: "Failed to Create Issue" }, { status: 500 });
    }
}
