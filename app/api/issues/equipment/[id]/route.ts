import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET Request to retrieve Equipment Issue
export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params; // Extract ID from route params
  
  try {
    const issue = await prisma.equipmentIssue.findUnique({
      where: { id: Number(id) }, // Ensure ID is numeric
      include: {
        issueItems: {
          include: {
            equipment: true, // Include related equipmentStock information
          },
        },
      },
    });

    if (!issue) {
      return new Response('Not found', { status: 404 });
    }

    return new Response(JSON.stringify(issue), { status: 200 });
  } catch (error) {
    console.log('Error fetching equipment issue:', error);
    return new Response('Error fetching equipment issue', { status: 500 });
  }
}

// PUT Request to update Equipment Issue
// PUT Request to update Equipment Issue and reflect returned quantity in EquipmentStock
export async function PUT(request: Request, { params }: { params: { id: string } }) {
    const { id } = await params; // Extract ID from params
  
    const { returnDate, status, returnedItems }: { returnDate: string; status: string; returnedItems: { id: number; returnedQuantity: number }[] } =
      await request.json();  // Extract the JSON payload
  
    try {
      if (!returnedItems) {
        return NextResponse.json({ message: 'No returned items provided' }, { status: 400 });
      }
  
      if (Array.isArray(returnedItems) && returnedItems.length > 0) {
        // Start a transaction to ensure consistency across both the issue and the stock updates
        const updatedIssue = await prisma.equipmentIssue.update({
          where: { id: parseInt(id, 10) },
          data: {
            returnDate: new Date(returnDate),
            status,
            issueItems: {
              updateMany: returnedItems.map((item) => ({
                where: { id: item.id },  // Find issue item by ID
                data: { returnedQuantity: item.returnedQuantity },  // Update the returnedQuantity for each item
              })),
            },
          },
          include: {
            issueItems: {
              include: {
                equipment: true,  // Get the associated equipment (EquipmentStock)
              },
            },
          },
        });
  
        // Loop through the updated items and adjust the EquipmentStock
        for (const item of returnedItems) {
          // Find the equipment associated with this issue item
          const equipmentStock = updatedIssue.issueItems.find((issueItem) => issueItem.id === item.id)?.equipment;
  
          if (equipmentStock) {
            // Update the quantity in EquipmentStock
            await prisma.equipmentStock.update({
              where: { id: equipmentStock.id },
              data: {
                quantity: { increment: item.returnedQuantity }, // Increase the stock quantity by the returned quantity
              },
            });
          }
        }
  
        return NextResponse.json(updatedIssue); // Respond with the updated issue
      } else {
        return NextResponse.json({ message: 'Invalid returnedItems data' }, { status: 400 });
      }
    } catch (error) {
      console.error('Error updating issue:', error);
      return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
  }
  