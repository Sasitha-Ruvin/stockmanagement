import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const materials = await prisma.material.findMany({
      where: {
        isDeleted: false,
      },
    });
    return NextResponse.json(materials);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch Material Stocks' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const formData = await request.formData();
  try {
    const name = formData.get('name')?.toString();
    const description = formData.get('description')?.toString();
    const quantity = formData.get('quantity')?.toString();
    const supplier = formData.get('supplier')?.toString();
    const unitPrice = formData.get('unitPrice')?.toString();
    const addedDate = formData.get('addedDate')?.toString();

    // Handle missing data if needed
    if (!name || !quantity || !supplier || !unitPrice) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Parse quantity as integer and unitPrice as float
    const parsedQuantity = parseInt(quantity, 10);
    const parsedUnitPrice = parseFloat(unitPrice);

    // Validate parsed values
    if (isNaN(parsedQuantity) || isNaN(parsedUnitPrice)) {
      return NextResponse.json({ error: 'Invalid quantity or unitPrice' }, { status: 400 });
    }

    const newItem = await prisma.material.create({
      data: {
        name,
        description,
        quantity: parsedQuantity,
        supplier,
        unitPrice: parsedUnitPrice,
      },
    });

    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    console.error("Error creating item:", error);
    return NextResponse.json({ error: 'Failed to create item' }, { status: 500 });
  }
}
