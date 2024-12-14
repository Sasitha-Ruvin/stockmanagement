import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        // Fetch all materials from the database
        const materials = await prisma.material.findMany({
            select: {
                id: true,
                name: true, // Only select the necessary fields (ID and name)
            },
        });

        // Format the fetched materials
        const formattedMaterials = materials.map((material) => ({
            materialId: material.id,
            materialName: material.name,
        }));

        // Return the list of materials as JSON response
        return NextResponse.json({ materials: formattedMaterials }, { status: 200 });
    } catch (error) {
        console.error("Error fetching materials list:", error);
        return NextResponse.json({ error: "Failed to fetch materials" }, { status: 500 });
    }
}
