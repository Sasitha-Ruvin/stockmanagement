"use client";

import React, { useEffect, useState } from "react";
import SideBar from "@/components/SideBar";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import ItemFrequencyChart from "@/components/ItemChart";
import PurchaseFrequencyChart from "@/components/FrequencyChart";
import { NotificationToast } from "@/components/NotificationToast";

const DashboardPage = () => {
    const router = useRouter();
    const [notifications, setNotifications] = useState<{ id: number; message: string }[]>([]);

    useEffect(() => {
        const authToken = Cookies.get("authToken");
        if (!authToken) {
            router.push("/");
        }else{
            fetchNotification();
        }
    }, [router]);

    const fetchNotification = async () => {
        try {
            const response = await fetch('/api/rent-orders/near-return');
            if(response.ok){
                const data = await response.json();
                const newNotification = data.map((order:any) => ({
                    id:order.id,
                    message:`Rent order for client ${order.client} is due for return on ${new Date(order.returnDate).toLocaleDateString()}`,

                }));
                setNotifications(newNotification);

            }
        } catch (error) {
            console.error("Failed to fetch notifications:", error);
        }
    }

    const closeNotification = (id: number) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
    }

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
            {notifications.map((notification)=>(
                <NotificationToast
                key={notification.id}
                message={notification.message}
                onClose={() => closeNotification(notification.id)}
                />
            ))}
        </div>
    );
};

export default DashboardPage;
