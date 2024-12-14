"use client";

import React, { useEffect, useState } from "react";
import { BarChart } from "@mui/x-charts/BarChart";

interface FrequencyData {
    purchaseDate: string;
    count: number;
}

interface YearRange {
    earliestYear: number;
    latestYear: number;
}

const PurchaseFrequencyChart = () => {
    const [data, setData] = useState<FrequencyData[]>([]);
    const [loading, setLoading] = useState(true);
    const [year, setYear] = useState<number>(new Date().getFullYear());
    const [month, setMonth] = useState<number | string>("");
    const [yearRange, setYearRange] = useState<YearRange | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await fetch(`/api/charts/materialpurchase?year=${year}&month=${month}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch data");
                }
                const result = await response.json();
                setData(result.data);

                setYearRange({
                    earliestYear: result.earliestYear,
                    latestYear: result.latestYear,
                });
            } catch (error) {
                console.error("Error fetching purchase frequency data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [year, month]);

    if (loading) {
        return <div>Loading...</div>;
    }

    const labels = data.map((item) => item.purchaseDate);
    const counts = data.map((item) => item.count);

    return (
        <div>
            <h2 className="text-lg font-bold">Material Purchase Frequency</h2>
            {yearRange && (
                <div className="mb-4">
                    <label htmlFor="year" className="mr-2">Select Year:</label>
                    <select
                        id="year"
                        value={year}
                        onChange={(e) => setYear(Number(e.target.value))}
                        className="p-2 border rounded"
                    >
                        {Array.from(
                            { length: yearRange.latestYear - yearRange.earliestYear + 1 },
                            (_, i) => yearRange.earliestYear + i
                        ).map((yearOption) => (
                            <option key={yearOption} value={yearOption}>
                                {yearOption}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            <div className="mb-4">
                <label htmlFor="month" className="mr-2">Select Month:</label>
                <select
                    id="month"
                    value={month}
                    onChange={(e) => setMonth(e.target.value || "")}
                    className="p-2 border rounded"
                >
                    <option value="">All Months</option>
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((monthOption) => (
                        <option key={monthOption} value={monthOption}>
                            {monthOption}
                        </option>
                    ))}
                </select>
            </div>

            <BarChart
                width={600}
                height={400}
                series={[{ data: counts, label: "Purchases" }]}
                xAxis={[{ scaleType: "band", data: labels }]}
            />
        </div>
    );
};

export default PurchaseFrequencyChart;
