import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const year = searchParams.get("year");
    const materialId = searchParams.get("materialId");

    try {
        const whereClause: any = {
            ...(year && {
                purchase: {
                    purchaseDate: {
                        gte: new Date(`${year}-01-01T00:00:00Z`),
                        lt: new Date(`${Number(year) + 1}-01-01T00:00:00Z`),
                    },
                },
            }),
            ...(materialId && { materialId: parseInt(materialId, 10) }),
        };

        // Aggregate purchase items
        const data = await prisma.purchaseItem.groupBy({
            by: ["materialId"],
            _sum: {
                quantity: true,
            },
            where: whereClause,
        });

        // Get material names
        const materialIds = data.map((item) => item.materialId);
        const materials = await prisma.material.findMany({
            where: { id: { in: materialIds } },
            select: { id: true, name: true },
        });

        const formattedData = data.map((item) => {
            const material = materials.find((m) => m.id === item.materialId);
            return {
                materialName: material?.name || "Unknown",
                totalQuantity: item._sum.quantity || 0,
            };
        });

        // Get year range
        const yearData = await prisma.purchase.findMany({
            select: { purchaseDate: true },
            orderBy: { purchaseDate: "asc" },
        });

        const earliestYear = yearData.length ? new Date(yearData[0].purchaseDate).getFullYear() : new Date().getFullYear();
        const latestYear = yearData.length ? new Date(yearData[yearData.length - 1].purchaseDate).getFullYear() : new Date().getFullYear();

        return NextResponse.json({
            data: formattedData,
            earliestYear,
            latestYear,
        }, { status: 200 });
    } catch (error) {
        console.error("Error fetching purchase data:", error);
        return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
    }
}
