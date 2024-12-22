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
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const { id } = await params; // Extract ID from params

  // Parsing the incoming JSON data for updating
  const { returnDate, status, returnedItems }: { returnDate: string; status: string; returnedItems: { id: number; returnedQuantity: number }[] } =
    await request.json();  // Extract the JSON payload
  
  try {
    // Check for valid returnedItems
    if (!returnedItems) {
      return NextResponse.json({ message: 'No returned items provided' }, { status: 400 });
    }

    // Ensure returnedItems is an array and has data
    if (Array.isArray(returnedItems) && returnedItems.length > 0) {
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
      });

      return NextResponse.json(updatedIssue); // Respond with the updated issue
    } else {
      return NextResponse.json({ message: 'Invalid returnedItems data' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error updating issue:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
