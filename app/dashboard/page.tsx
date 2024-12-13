"use client";

import React, { useEffect, useState } from 'react';
import SideBar from '@/components/SideBar';
import { BarChart } from '@mui/x-charts/BarChart';

interface FrequencyData {
    purchaseDate: string;
    count: number;
}

const DashboardPage = () => {
    const [data, setData] = useState<FrequencyData[]>([]);
    const [loading, setLoading] = useState(true);
    const [year, setYear] = useState<number>(new Date().getFullYear());
    const [month, setMonth] = useState<number | string>("");

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true); // Add this line to show the loading state when fetching
            try {
                const response = await fetch(`/api/charts/materialpurchase?year=${year}&month=${month}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                const result: FrequencyData[] = await response.json();
                setData(result);
            } catch (error) {
                console.error("Error fetching chart data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [year, month]); // The fetch will re-run when the year or month changes

    if (loading) {
        return <div>Loading...</div>;
    }

    const labels = data.map(item => item.purchaseDate);
    const counts = data.map(item => item.count);

    return (
        <div className="flex h-screen">
            <SideBar />
            <div className="flex-1 p-6">
                <h1 className="text-xl font-bold">Material Purchase Frequency</h1>
                <div className="mb-4">
                    <label htmlFor="year" className="mr-2">Select Year:</label>
                    <select
                        id="year"
                        value={year}
                        onChange={(e) => setYear(Number(e.target.value))}
                        className="p-2 border rounded"
                    >
                        {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map((yearOption) => (
                            <option key={yearOption} value={yearOption}>
                                {yearOption}
                            </option>
                        ))}
                    </select>
                </div>

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
                    series={[{ data: counts, label: 'Purchases' }]}
                    xAxis={[{ scaleType: 'band', data: labels }]}
                />
            </div>
        </div>
    );
};

export default DashboardPage;
