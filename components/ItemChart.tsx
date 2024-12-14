"use client";

import React, { useEffect, useState } from "react";
import { BarChart } from "@mui/x-charts/BarChart";

interface ItemData {
    materialId: number;
    materialName: string;
    totalQuantity: number;
}

interface YearRange {
    earliestYear: number;
    latestYear: number;
}

const ItemFrequencyChart = () => {
    const [itemData, setItemData] = useState<ItemData[]>([]);
    const [loading, setLoading] = useState(true);
    const [year, setYear] = useState<number>(new Date().getFullYear());
    const [yearRange, setYearRange] = useState<YearRange | null>(null);
    const [allMaterials, setAllMaterials] = useState<ItemData[]>([]); // List of all materials
    const [selectedMaterial, setSelectedMaterial] = useState<number | null>(null); // Selected material ID

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch filtered item data
                const response = await fetch(
                    `/api/charts/materialpurchase/purchaseByItem?year=${year}&materialId=${selectedMaterial || ""}`
                );
                if (!response.ok) throw new Error("Failed to fetch item data");

                const result = await response.json();
                setItemData(result.data);

                setYearRange({
                    earliestYear: result.earliestYear,
                    latestYear: result.latestYear,
                });

                // Fetch materials for dropdown (once)
                if (!allMaterials.length) {
                    const materialsResponse = await fetch(`/api/charts/materialpurchase/materiallist`);
                    if (!materialsResponse.ok) throw new Error("Failed to fetch materials list");

                    const materialsResult = await materialsResponse.json();
                    setAllMaterials(materialsResult.materials);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [year, selectedMaterial]);

    if (loading) {
        return <div>Loading...</div>;
    }

    const itemLabels = itemData.map((item) => item.materialName);
    const itemCounts = itemData.map((item) => item.totalQuantity);

    return (
        <div>
            <h2 className="text-lg font-bold">Purchase Frequency by Items</h2>

            <div className="mb-4">
                {/* Year Dropdown */}
                {yearRange && (
                    <div className="mb-4">
                        <label htmlFor="item-year" className="mr-2">Filter by Year:</label>
                        <select
                            id="item-year"
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

                {/* Item Dropdown */}
                {allMaterials.length > 0 && (
                    <div className="mb-4">
                        <label htmlFor="item-filter" className="mr-2">Filter by Item:</label>
                        <select
                            id="item-filter"
                            value={selectedMaterial || ""}
                            onChange={(e) => setSelectedMaterial(Number(e.target.value) || null)}
                            className="p-2 border rounded"
                        >
                            <option value="">All Items</option>
                            {allMaterials.map((material) => (
                                <option key={material.materialId} value={material.materialId}>
                                    {material.materialName}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
            </div>

            {/* Bar Chart */}
            <BarChart
                width={600}
                height={400}
                series={[{ data: itemCounts, label: "Quantities Purchased" }]}
                xAxis={[{ scaleType: "band", data: itemLabels }]}
            />
        </div>
    );
};

export default ItemFrequencyChart;
