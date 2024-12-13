import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
    const url = new URL(request.url);
    const year = url.searchParams.get("year") || new Date().getFullYear();
    const month = url.searchParams.get("month");

    try {
        const whereCondition: any = {
            purchaseDate: {
                gte: new Date(`${year}-01-01`),
                lte: new Date(`${year}-12-31`),
            },
        };

        // If a month is selected, filter the data by the selected month
        if (month) {
            const startOfMonth = new Date(`${year}-${month}-01`);
            const endOfMonth = new Date(startOfMonth);
            endOfMonth.setMonth(startOfMonth.getMonth() + 1); // Set to the first day of next month

            whereCondition.purchaseDate = {
                gte: startOfMonth,
                lte: endOfMonth,
            };
        }

        const groupByField = month ? 'purchaseDate' : 'purchaseDate'; // No change here for "All Months"

        const data = await prisma.purchase.groupBy({
            by: [groupByField],
            _count: {
                id: true,
            },
            where: whereCondition,
        });

        const formattedData = data.map(item => {
            const date = new Date(item.purchaseDate);
            const yearMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            return {
                purchaseDate: month ? item.purchaseDate.toISOString().split('T')[0] : yearMonth,
                count: item._count.id,
            };
        });

        // Get the range of years
        const yearData = await prisma.purchase.findMany({
            select: {
                purchaseDate: true
            },
            distinct: ['purchaseDate'],
            orderBy: { purchaseDate: 'asc' }
        });

        const earliestYear = new Date(yearData[0].purchaseDate).getFullYear();
        const latestYear = new Date(yearData[yearData.length - 1].purchaseDate).getFullYear();

        return NextResponse.json({ data: formattedData, earliestYear, latestYear }, { status: 200 });
    } catch (error) {
        console.error("Error fetching purchase frequency:", error);
        return NextResponse.json({ error: "Failed to fetch frequency data" }, { status: 500 });
    }
}
