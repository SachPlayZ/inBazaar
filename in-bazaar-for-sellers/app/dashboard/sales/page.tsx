"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RecentSales } from "@/components/recent-sales";
import { salesService, Sale } from "@/services/sales";

interface SalesOverview {
  totalSales: number;
  totalRevenue: number;
  averageOrderValue: number;
}

export default function SalesPage() {
  const [salesOverview, setSalesOverview] = useState<SalesOverview>({
    totalSales: 0,
    totalRevenue: 0,
    averageOrderValue: 0,
  });
  const [recentSales, setRecentSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const [overview, recent] = await Promise.all([
          salesService.getSalesOverview(),
          salesService.getRecentSales(),
        ]);
        setSalesOverview(overview);
        setRecentSales(recent);
      } catch (error) {
        console.error("Failed to fetch sales data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSalesData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Sales</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Sales Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <p className="text-sm font-medium">Total Sales</p>
                <p className="text-2xl font-bold">{salesOverview.totalSales}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Total Revenue</p>
                <p className="text-2xl font-bold">
                  ₹{salesOverview.totalRevenue.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Average Order Value</p>
                <p className="text-2xl font-bold">
                  ₹{salesOverview.averageOrderValue.toFixed(2)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentSales sales={recentSales} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
