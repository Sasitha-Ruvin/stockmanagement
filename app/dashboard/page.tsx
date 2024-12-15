"use client";

import React, { useEffect, useState } from "react";
import SideBar from "@/components/SideBar";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import ItemFrequencyChart from "@/components/ItemChart";
import PurchaseFrequencyChart from "@/components/FrequencyChart";

const DashboardPage = () => {
    const router = useRouter();

    useEffect(() => {
        const authToken = Cookies.get("authToken");
        if (!authToken) {
            router.push("/");
        }
    }, [router]);

    return (
        <div className="flex h-screen">
            <SideBar />
            <div className="flex-1 overflow-y-auto p-6">
                <h1 className="text-xl font-bold">Dashboard</h1>
                <div className="grid grid-cols-2 gap-5">
                    <PurchaseFrequencyChart/>
                    <ItemFrequencyChart/>
                </div>
                
            </div>
        </div>
    );
};

export default DashboardPage;
